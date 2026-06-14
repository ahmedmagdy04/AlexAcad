import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Send, Plus, GraduationCap, Lock, Bot, User, AlertCircle, Paperclip, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api, { uploadRegistrationPdf } from '../api/api';
import '../styles/AiChat.css';

const AI_SUGGESTIONS = [
  'What departments are available?',
  'كم ساعة أحتاج للتصعيد؟',
  'متى تُفتح الإدارات؟',
  'كم ساعة أسجل وأنا مراقب عتبياً؟',
  'What are improvement courses?',
  'متى يتم الفصل النهائي؟',
];

const INITIAL_MSG = {
  id: 1,
  role: 'assistant',
  text: "Welcome! 🤝 I'm your AI academic assistant at the Faculty of Business, Alexandria University. Ask me anything in Arabic or English!",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Map a single validation result item to a readable status line */
const renderValidationRow = (item, idx) => {
  const icon = item.allowed ? (
    <CheckCircle size={14} className="vc-icon vc-icon--ok" />
  ) : (
    <XCircle size={14} className="vc-icon vc-icon--err" />
  );

  return (
    <div key={idx} className="vc-row">
      {icon}
      <div>
        <span className="vc-name">{item.course}</span>
        {item.reason && <p className="vc-reason">{item.reason}</p>}
      </div>
    </div>
  );
};

/** Render validation results as a structured chat bubble */
const ValidationBubble = ({ validation }) => {
  if (!validation || !Array.isArray(validation) || validation.length === 0) return null;

  return (
    <div className="vc-bubble">
      <p className="vc-title">📋 Registration Validation</p>
      {validation.map(renderValidationRow)}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AiChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [chatError, setChatError] = useState('');

  // Upload state
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | uploading | analyzing | done | error
  const [uploadError, setUploadError] = useState('');

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Auto-grow textarea
  const handleTextareaInput = useCallback((e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
    setInput(el.value);
  }, []);

  // ── Send message ─────────────────────────────────────────────────────────

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setChatError('');

    const userMsg = { id: Date.now(), role: 'user', text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    try {
      const { data } = await api.post('/chat/send', { message: msg });
      const reply = data.reply || data.message || data.response || 'No response received.';
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: reply },
      ]);
    } catch (err) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to get a response. Please try again.';
      setChatError(errMsg);
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── File upload ──────────────────────────────────────────────────────────

  const handleAttachClick = () => {
    if (uploadStatus === 'uploading' || uploadStatus === 'analyzing') return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    // Reset input so the same file can be re-selected after an error
    e.target.value = '';

    if (!file) return;

    // Client-side PDF guard
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setUploadError('Only PDF files are accepted. Please select a valid PDF.');
      setUploadStatus('error');
      return;
    }

    setUploadError('');
    setUploadStatus('uploading');

    // Inject "Uploading…" status message into chat
    const uploadingMsgId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: uploadingMsgId,
        role: 'system',
        text: '📎 Uploading registration PDF…',
        isStatus: true,
      },
    ]);

    try {
      // Short delay so the user sees "Uploading…" before "Analyzing…"
      await new Promise((r) => setTimeout(r, 600));
      setUploadStatus('analyzing');

      // Replace the status message with "Analyzing…"
      setMessages((prev) =>
        prev.map((m) =>
          m.id === uploadingMsgId
            ? { ...m, text: '🔍 Analyzing registration…' }
            : m
        )
      );

      const { data } = await uploadRegistrationPdf(file);

      // Remove the temporary status message
      setMessages((prev) => prev.filter((m) => m.id !== uploadingMsgId));

      setUploadStatus('done');

      // Success system message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'system',
          text: 'Registration uploaded successfully. I have analyzed your registered courses and can now review your schedule.',
        },
      ]);

      // Validation results bubble
      if (data.validation && data.validation.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: 'assistant',
            text: null,
            validation: data.validation,
          },
        ]);
      }
    } catch (err) {
      // Remove the status message on error
      setMessages((prev) => prev.filter((m) => m.id !== uploadingMsgId));

      setUploadStatus('error');

      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;

      let friendlyMsg;
      if (status === 415 || serverMsg?.toLowerCase().includes('invalid file')) {
        friendlyMsg = '⚠️ Invalid PDF — please upload a valid registration PDF.';
      } else if (status === 422) {
        friendlyMsg =
          serverMsg ||
          '⚠️ The document appears to be empty or could not be read. Please try a different PDF.';
      } else if (status === 400) {
        friendlyMsg = serverMsg || '⚠️ No file was received by the server.';
      } else {
        friendlyMsg = serverMsg || '⚠️ Upload failed. Please try again.';
      }

      setUploadError(friendlyMsg);
    }
  };

  const handleNewChat = () => {
    setMessages([INITIAL_MSG]);
    setChatError('');
    setUploadStatus('idle');
    setUploadError('');
  };

  const isUploading =
    uploadStatus === 'uploading' || uploadStatus === 'analyzing';

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <button className="ai-chat-btn" onClick={() => setOpen(true)} aria-label="Open AI Assistant">
        <Bot size={22} />
      </button>

      {open && (
        <>
          <div className="ai-chat-overlay" onClick={() => setOpen(false)} />
          <div className="ai-chat-panel">
            {/* ── Sidebar ── */}
            <div className="ai-chat-sidebar">
              <div className="ai-chat-sidebar__header">
                <div className="ai-chat-sidebar__brand">
                  <div className="ai-chat-sidebar__brand-icon">
                    <GraduationCap size={16} />
                  </div>
                  <span className="ai-chat-sidebar__brand-name">AlexAcad AI</span>
                </div>
                <button className="ai-chat-sidebar__new-btn" onClick={handleNewChat}>
                  <Plus size={14} />
                  New Chat
                </button>
              </div>

              <div className="ai-chat-sidebar__section">
                <div className="ai-chat-sidebar__section-label">Session</div>
                {user ? (
                  <div className="ai-chat-sidebar__user">
                    <div className="ai-chat-sidebar__user-avatar">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="ai-chat-sidebar__user-name">{user.name}</p>
                      <p className="ai-chat-sidebar__user-dept">{user.department || 'Faculty of Business'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="ai-chat-sidebar__empty">
                    <Lock size={28} className="ai-chat-sidebar__empty-icon" />
                    <p className="ai-chat-sidebar__empty-text">Login to save conversations.</p>
                  </div>
                )}
              </div>

              {/* ── Upload Registration button ── */}
              <div className="ai-chat-sidebar__upload-section">
                <div className="ai-chat-sidebar__section-label">Documents</div>
                <button
                  className={`ai-chat-sidebar__upload-btn${
                    isUploading ? ' ai-chat-sidebar__upload-btn--busy' : ''
                  }${uploadStatus === 'done' ? ' ai-chat-sidebar__upload-btn--done' : ''}`}
                  onClick={handleAttachClick}
                  disabled={isUploading}
                  id="sidebar-upload-registration-btn"
                  aria-label="Upload registration PDF"
                >
                  {isUploading ? (
                    <>
                      <span className="ai-chat-attach__spinner" />
                      <span>{uploadStatus === 'uploading' ? 'Uploading…' : 'Analyzing…'}</span>
                    </>
                  ) : uploadStatus === 'done' ? (
                    <>
                      <CheckCircle size={15} />
                      <span>Registration Uploaded ✓</span>
                    </>
                  ) : (
                    <>
                      <FileText size={15} />
                      <span>Upload Registration PDF</span>
                    </>
                  )}
                </button>

                {uploadStatus === 'error' && (
                  <p className="ai-chat-sidebar__upload-err">Upload failed — try again</p>
                )}
              </div>
            </div>

            {/* ── Main ── */}
            <div className="ai-chat-main">
              <div className="ai-chat-main__header">
                <h2 className="ai-chat-main__title">AI Academic Assistant</h2>
                <button className="ai-chat-main__close" onClick={() => setOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="ai-chat-suggestions">
                {AI_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="ai-chat-suggestion-pill"
                    onClick={() => sendMessage(s)}
                    disabled={typing || isUploading}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="ai-chat-messages">
                {messages.map((msg) => {
                  // System / status messages
                  if (msg.role === 'system') {
                    return (
                      <div key={msg.id} className={`ai-chat-system-msg${msg.isStatus ? ' ai-chat-system-msg--status' : ''}`}>
                        {msg.text}
                      </div>
                    );
                  }

                  // Assistant message with validation
                  if (msg.role === 'assistant' && msg.validation) {
                    return (
                      <div key={msg.id} className="ai-chat-msg assistant">
                        <div className="ai-chat-msg__avatar">
                          <GraduationCap size={16} />
                        </div>
                        <div className="ai-chat-msg__bubble ai-chat-msg__bubble--validation">
                          <ValidationBubble validation={msg.validation} />
                        </div>
                      </div>
                    );
                  }

                  // Normal messages
                  return (
                    <div key={msg.id} className={`ai-chat-msg ${msg.role}`}>
                      <div className="ai-chat-msg__avatar">
                        {msg.role === 'assistant' ? (
                          <GraduationCap size={16} />
                        ) : (
                          <span style={{ fontSize: '13px', fontWeight: 700 }}>
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="ai-chat-msg__bubble">{msg.text}</div>
                    </div>
                  );
                })}

                {typing && (
                  <div className="ai-chat-msg assistant">
                    <div className="ai-chat-msg__avatar">
                      <GraduationCap size={16} />
                    </div>
                    <div className="ai-chat-msg__bubble">
                      <div className="ai-chat-typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  </div>
                )}

                {chatError && (
                  <div className="ai-chat-error">
                    <AlertCircle size={14} />
                    {chatError}
                  </div>
                )}

                {uploadError && (
                  <div className="ai-chat-error">
                    <AlertCircle size={14} />
                    {uploadError}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Input area ── */}
              <div className="ai-chat-input-area">
                {/* Hidden file input — PDF only */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  id="ai-chat-file-input"
                />

                {/* Attach button */}
                <button
                  className={`ai-chat-attach${isUploading ? ' ai-chat-attach--busy' : ''}`}
                  onClick={handleAttachClick}
                  disabled={isUploading}
                  aria-label="Upload registration PDF"
                  title={isUploading ? 'Processing…' : 'Upload registration PDF'}
                >
                  {isUploading ? (
                    <span className="ai-chat-attach__spinner" />
                  ) : (
                    <Paperclip size={15} />
                  )}
                </button>

                {/* Auto-grow textarea */}
                <textarea
                  ref={textareaRef}
                  className="ai-chat-input ai-chat-input--textarea"
                  value={input}
                  onInput={handleTextareaInput}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask me anything — in Arabic or English… (Shift+Enter for new line)"
                  disabled={typing || isUploading}
                  rows={1}
                />

                {/* Send button */}
                <button
                  className="ai-chat-send"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || typing || isUploading}
                  aria-label="Send"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
