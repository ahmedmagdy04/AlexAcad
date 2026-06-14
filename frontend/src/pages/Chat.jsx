import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import {
  Send, Plus, GraduationCap, Bot, User, AlertCircle,
  FileText, Upload, MoreHorizontal, Pencil, Trash2,
  Check, X, Menu, ChevronLeft, Paperclip,
  CheckCircle, XCircle, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  listConversations,
  createConversation,
  getConversation,
  sendChatMessage,
  renameConversation,
  deleteConversation,
  uploadRegistrationPdf,
} from '../api/api';
import CertificateUpload from '../components/CertificateUpload';
import '../styles/Chat.css';

// ── Constants ──────────────────────────────────────────────────────────────

const AI_SUGGESTIONS = [
  'What departments are available?',
  'كم ساعة أحتاج للتصعيد؟',
  'متى تُفتح الإدارات؟',
  'كم ساعة أسجل وأنا مراقب عتبياً؟',
  'What are improvement courses?',
  'متى يتم الفصل النهائي؟',
];

const WELCOME_MSG = {
  id: '__welcome__',
  role: 'assistant',
  text: "Welcome! 🤝 I'm your AI academic assistant at the Faculty of Business, Alexandria University. Ask me anything in Arabic or English!",
};

const LS_CONV_KEY = 'alexacad_active_conv';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Convert Mongo message → local UI message */
const dbMsgToUi = (m) => ({
  id: m._id || m.id || String(Date.now() + Math.random()),
  role: m.role,          // 'user' | 'assistant' | 'system'
  text: m.content || m.text || null,
  // Preserve validation data so the bubble survives page reloads
  ...(m.validation?.length ? { validation: m.validation } : {}),
});

/** Friendly error text from axios error */
const friendlyErr = (err, fallback = 'Something went wrong.') =>
  err?.response?.data?.message || err?.response?.data?.error || fallback;

// ── ValidationBubble ───────────────────────────────────────────────────────

function ValidationBubble({ validation }) {
  if (!Array.isArray(validation) || validation.length === 0) return null;
  return (
    <div className="vc-bubble">
      <p className="vc-title">📋 Registration Validation</p>
      {validation.map((item, i) => {
        const icon = item.allowed ? (
            <CheckCircle size={13} className="vc-icon vc-icon--ok" />
          ) : (
            <XCircle size={13} className="vc-icon vc-icon--err" />
          );
        return (
          <div key={i} className="vc-row">
            {icon}
            <div>
              <span className="vc-name">{item.course}</span>
              {item.reason && <p className="vc-reason">{item.reason}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── ConversationItem ───────────────────────────────────────────────────────

function ConversationItem({
  conv, isActive, onSelect, onRename, onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(conv.title);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const commitRename = () => {
    const t = draft.trim();
    if (t && t !== conv.title) onRename(conv._id, t);
    setEditing(false);
  };

  const startEdit = () => {
    setDraft(conv.title);
    setEditing(true);
    setMenuOpen(false);
    setTimeout(() => inputRef.current?.select(), 30);
  };

  return (
    <div
      className={`conv-item${isActive ? ' conv-item--active' : ''}`}
      onClick={() => !editing && onSelect(conv._id)}
    >
      {editing ? (
        <div className="conv-item__rename" onClick={(e) => e.stopPropagation()}>
          <input
            ref={inputRef}
            className="conv-item__rename-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename();
              if (e.key === 'Escape') setEditing(false);
            }}
            autoFocus
          />
          <button className="conv-item__rename-ok" onClick={commitRename} aria-label="Save">
            <Check size={13} />
          </button>
          <button className="conv-item__rename-cancel" onClick={() => setEditing(false)} aria-label="Cancel">
            <X size={13} />
          </button>
        </div>
      ) : (
        <>
          <span className="conv-item__title">{conv.title}</span>
          <div
            className="conv-item__menu-wrap"
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="conv-item__menu-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Options"
            >
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <div className="conv-item__dropdown">
                <button onClick={startEdit}>
                  <Pencil size={13} /> Rename
                </button>
                <button
                  className="conv-item__dropdown-delete"
                  onClick={() => { setMenuOpen(false); onDelete(conv._id); }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Chat Page ─────────────────────────────────────────────────────────

export default function Chat() {
  const { user } = useAuth();

  // ── Sidebar state ────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(() => localStorage.getItem(LS_CONV_KEY) || null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── View: 'chat' | 'certificate' ────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('chat');

  // ── Message state ────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [chatError, setChatError] = useState('');
  const [loadingConv, setLoadingConv] = useState(false);

  // ── Upload state ─────────────────────────────────────────────────────────
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle|uploading|analyzing|done|error
  const [uploadError, setUploadError] = useState('');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // ── Scroll helpers ───────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // ── Load conversation list on mount ─────────────────────────────────────
  useEffect(() => {
    fetchConversations();
  }, []); // intentionally empty — runs once on mount

  // ── Load active conversation when activeId changes ───────────────────────
  useEffect(() => {
    if (activeId) {
      localStorage.setItem(LS_CONV_KEY, activeId);
      loadConversation(activeId);
    } else {
      setMessages([WELCOME_MSG]);
    }
  }, [activeId]); // intentionally omits loadConversation (stable ref not needed)

  // ── Fetch conversation list ──────────────────────────────────────────────
  const fetchConversations = async () => {
    try {
      const { data } = await listConversations();
      setConversations(data);

      // If no stored active conversation pick the most recent one
      const stored = localStorage.getItem(LS_CONV_KEY);
      if (data.length > 0 && (!stored || !data.find((c) => c._id === stored))) {
        setActiveId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
    }
  };

  // ── Load a single conversation's messages ───────────────────────────────
  const loadConversation = async (id) => {
    setLoadingConv(true);
    setChatError('');
    try {
      const { data } = await getConversation(id);
      const uiMsgs = data.messages?.map(dbMsgToUi) || [];
      setMessages(uiMsgs.length ? uiMsgs : [WELCOME_MSG]);
    } catch (err) {
      setChatError(friendlyErr(err, 'Failed to load conversation.'));
      setMessages([WELCOME_MSG]);
    } finally {
      setLoadingConv(false);
    }
  };

  // ── New Chat ─────────────────────────────────────────────────────────────
  const handleNewChat = async () => {
    try {
      const { data } = await createConversation();
      setConversations((prev) => [data, ...prev]);
      setActiveId(data._id);
      setMessages([WELCOME_MSG]);
      setChatError('');
      setUploadStatus('idle');
      setUploadError('');
    } catch (err) {
      setChatError(friendlyErr(err, 'Failed to create conversation.'));
    }
  };

  // ── Select conversation from sidebar ─────────────────────────────────────
  const handleSelectConversation = (id) => {
    if (id === activeId) return;
    setActiveId(id);
    setChatError('');
  };

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || typing) return;

    // Create a conversation on the fly if none exists
    let convId = activeId;
    if (!convId) {
      try {
        const { data } = await createConversation();
        convId = data._id;
        setConversations((prev) => [data, ...prev]);
        setActiveId(convId);
      } catch (err) {
        setChatError(friendlyErr(err, 'Failed to create conversation.'));
        return;
      }
    }

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setChatError('');

    const userMsg = { id: Date.now(), role: 'user', text: msg };
    setMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== '__welcome__');
      return [...filtered, userMsg];
    });
    setTyping(true);

    try {
      const { data } = await sendChatMessage(convId, msg);
      const reply = data.reply || data.message || 'No response received.';

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: reply },
      ]);

      // Refresh sidebar to pick up the auto-generated title
      const { data: convList } = await listConversations();
      setConversations(convList);
    } catch (err) {
      setChatError(friendlyErr(err, 'Failed to get a response. Please try again.'));
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setTyping(false);
    }
  };

  // ── Rename ───────────────────────────────────────────────────────────────
  const handleRename = async (id, title) => {
    try {
      await renameConversation(id, title);
      setConversations((prev) =>
        prev.map((c) => (c._id === id ? { ...c, title } : c))
      );
    } catch (err) {
      setChatError(friendlyErr(err, 'Failed to rename.'));
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteConversation(id);
      const updated = conversations.filter((c) => c._id !== id);
      setConversations(updated);

      if (id === activeId) {
        if (updated.length > 0) {
          setActiveId(updated[0]._id);
        } else {
          setActiveId(null);
          localStorage.removeItem(LS_CONV_KEY);
          setMessages([WELCOME_MSG]);
        }
      }
    } catch (err) {
      setChatError(friendlyErr(err, 'Failed to delete conversation.'));
    }
  };

  // ── Keyboard handler ─────────────────────────────────────────────────────
  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Auto-grow textarea ───────────────────────────────────────────────────
  const handleTextareaInput = useCallback((e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
    setInput(el.value);
  }, []);

  // ── File upload ──────────────────────────────────────────────────────────
  const handleAttachClick = () => {
    if (uploadStatus === 'uploading' || uploadStatus === 'analyzing') return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setUploadError('Only PDF files are accepted.');
      setUploadStatus('error');
      return;
    }

    setUploadError('');
    setUploadStatus('uploading');

    const statusId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: statusId, role: 'system', text: '📎 Uploading registration PDF…', isStatus: true },
    ]);

    try {
      await new Promise((r) => setTimeout(r, 500));
      setUploadStatus('analyzing');
      setMessages((prev) =>
        prev.map((m) => (m.id === statusId ? { ...m, text: '🔍 Analyzing registration…' } : m))
      );

      const { data } = await uploadRegistrationPdf(file, activeId);

      setMessages((prev) => prev.filter((m) => m.id !== statusId));
      setUploadStatus('done');

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'system',
          text: 'Registration uploaded successfully. I have analyzed your registered courses and can now review your schedule.',
        },
      ]);

      if (data.validation?.length > 0) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: 'assistant', text: null, validation: data.validation },
        ]);
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== statusId));
      setUploadStatus('error');

      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message;
      let msg;
      if (status === 422) msg = serverMsg || '⚠️ Could not read the PDF. Try a different file.';
      else if (status === 400) msg = serverMsg || '⚠️ No file received.';
      else msg = serverMsg || '⚠️ Upload failed. Please try again.';
      setUploadError(msg);
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const isUploading = uploadStatus === 'uploading' || uploadStatus === 'analyzing';
  const isBusy = typing || isUploading;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="chat-page">
      {/* ── Sidebar ── */}
      <aside className={`chat-sidebar${sidebarOpen ? '' : ' chat-sidebar--collapsed'}`}>
        {/* Brand */}
        <div className="chat-sidebar__top">
          <div className="chat-sidebar__brand">
            <div className="chat-sidebar__brand-icon">
              <GraduationCap size={18} />
            </div>
            {sidebarOpen && (
              <span className="chat-sidebar__brand-name">AlexAcad AI</span>
            )}
          </div>
          <button
            className="chat-sidebar__toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* New Chat */}
        <button className="chat-sidebar__new-btn" onClick={handleNewChat} title="New Chat">
          <Plus size={14} />
          {sidebarOpen && <span>New Chat</span>}
        </button>

        {/* Nav tabs */}
        <nav className="chat-sidebar__nav">
          <button
            className={`chat-sidebar__nav-item${activeTab === 'chat' ? ' active' : ''}`}
            onClick={() => setActiveTab('chat')}
            title="AI Advisor"
          >
            <Bot size={15} />
            {sidebarOpen && <span>AI Advisor</span>}
          </button>
          <button
            className={`chat-sidebar__nav-item${activeTab === 'certificate' ? ' active' : ''}`}
            onClick={() => setActiveTab('certificate')}
            title="Certificate Upload"
          >
            <FileText size={15} />
            {sidebarOpen && <span>Certificate Upload</span>}
          </button>
        </nav>

        {/* Conversation history */}
        {sidebarOpen && activeTab === 'chat' && (
          <div className="chat-sidebar__history">
            {conversations.length === 0 ? (
              <p className="chat-sidebar__history-empty">No conversations yet</p>
            ) : (
              <>
                <p className="chat-sidebar__history-label">Recent</p>
                {conversations.map((conv) => (
                  <ConversationItem
                    key={conv._id}
                    conv={conv}
                    isActive={conv._id === activeId}
                    onSelect={handleSelectConversation}
                    onRename={handleRename}
                    onDelete={handleDelete}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {/* User info */}
        <div className="chat-sidebar__user">
          <div className="chat-sidebar__user-avatar">
            <User size={16} />
          </div>
          {sidebarOpen && (
            <div className="chat-sidebar__user-info">
              <p className="chat-sidebar__user-name">{user?.name || 'Student'}</p>
              <p className="chat-sidebar__user-dept">{user?.department || 'Faculty of Business'}</p>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main className="chat-main">
        {activeTab === 'chat' ? (
          <>
            {/* Header */}
            <div className="chat-main__header">
              <div className="chat-main__header-icon"><Bot size={20} /></div>
              <div>
                <h1 className="chat-main__title">
                  {conversations.find((c) => c._id === activeId)?.title || 'AI Academic Advisor'}
                </h1>
                <p className="chat-main__sub">Ask anything about your studies, courses, or regulations</p>
              </div>
            </div>

            {/* Suggestion pills — only when no real messages */}
            {messages.length <= 1 && messages[0]?.id === '__welcome__' && (
              <div className="chat-suggestions">
                {AI_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="chat-suggestion-pill"
                    onClick={() => sendMessage(s)}
                    disabled={isBusy}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="chat-messages">
              {loadingConv ? (
                <div className="chat-loading">
                  <span className="chat-loading__spinner" />
                  Loading conversation…
                </div>
              ) : (
                messages.map((msg) => {
                  // System / status pill
                  if (msg.role === 'system') {
                    return (
                      <div
                        key={msg.id}
                        className={`chat-system-msg${msg.isStatus ? ' chat-system-msg--status' : ''}`}
                      >
                        {msg.text}
                      </div>
                    );
                  }

                  // Validation bubble (assistant message with no text)
                  if (msg.role === 'assistant' && msg.validation) {
                    return (
                      <div key={msg.id} className="chat-msg assistant">
                        <div className="chat-msg__avatar">
                          <GraduationCap size={16} />
                        </div>
                        <div className="chat-msg__content">
                          <p className="chat-msg__sender">AlexAcad AI</p>
                          <ValidationBubble validation={msg.validation} />
                        </div>
                      </div>
                    );
                  }

                  // Normal message
                  return (
                    <div key={msg.id} className={`chat-msg ${msg.role}`}>
                      <div className="chat-msg__avatar">
                        {msg.role === 'assistant' ? (
                          <GraduationCap size={16} />
                        ) : (
                          <span className="chat-msg__avatar-initials">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="chat-msg__content">
                        <p className="chat-msg__sender">
                          {msg.role === 'assistant' ? 'AlexAcad AI' : (user?.name || 'You')}
                        </p>
                        <div className="chat-msg__bubble">{msg.text}</div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {typing && (
                <div className="chat-msg assistant">
                  <div className="chat-msg__avatar"><GraduationCap size={16} /></div>
                  <div className="chat-msg__content">
                    <p className="chat-msg__sender">AlexAcad AI</p>
                    <div className="chat-msg__bubble chat-msg__bubble--typing">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}

              {/* Errors */}
              {chatError && (
                <div className="chat-error">
                  <AlertCircle size={14} />
                  {chatError}
                </div>
              )}
              {uploadError && (
                <div className="chat-error">
                  <AlertCircle size={14} />
                  {uploadError}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="chat-input-area">
              {/* Hidden PDF input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                id="chat-file-input"
              />

              {/* Attach button */}
              <button
                className={`chat-attach-btn${isUploading ? ' chat-attach-btn--busy' : ''}`}
                onClick={handleAttachClick}
                disabled={isUploading}
                aria-label="Upload registration PDF"
                title={isUploading ? 'Processing…' : 'Upload registration PDF'}
              >
                {isUploading ? (
                  <span className="chat-attach-btn__spinner" />
                ) : (
                  <Paperclip size={16} />
                )}
              </button>

              {/* Auto-grow textarea */}
              <textarea
                ref={textareaRef}
                className="chat-input chat-input--textarea"
                value={input}
                onInput={handleTextareaInput}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything — in Arabic or English… (Shift+Enter for new line)"
                disabled={isBusy}
                rows={1}
              />

              {/* Send */}
              <button
                className="chat-send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isBusy}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          /* Certificate upload tab */
          <div className="chat-certificate-area">
            <div className="chat-main__header">
              <div className="chat-main__header-icon"><Upload size={20} /></div>
              <div>
                <h1 className="chat-main__title">Certificate Upload</h1>
                <p className="chat-main__sub">Upload your PDF certificate for processing and verification</p>
              </div>
            </div>
            <CertificateUpload />
          </div>
        )}
      </main>
    </div>
  );
}
