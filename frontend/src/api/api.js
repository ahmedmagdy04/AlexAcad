import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ── Auth token injection ───────────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Global 401 handler ─────────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ── Conversation API helpers ───────────────────────────────────────────────

/** GET /api/chat/conversations — list all conversations (newest first) */
export const listConversations = () =>
    api.get('/chat/conversations');

/** POST /api/chat/conversation — create new empty conversation */
export const createConversation = () =>
    api.post('/chat/conversation');

/** GET /api/chat/conversation/:id — load a conversation with messages */
export const getConversation = (id) =>
    api.get(`/chat/conversation/${id}`);

/** PUT /api/chat/conversation/:id — rename conversation */
export const renameConversation = (id, title) =>
    api.put(`/chat/conversation/${id}`, { title });

/** DELETE /api/chat/conversation/:id — delete conversation */
export const deleteConversation = (id) =>
    api.delete(`/chat/conversation/${id}`);

/** POST /api/chat/send/:conversationId — send a message */
export const sendChatMessage = (conversationId, message) =>
    api.post(`/chat/send/${conversationId}`, { message });

// ── Registration PDF upload ────────────────────────────────────────────────

/**
 * Upload a registration PDF.
 * @param {File}   file
 * @param {string} [conversationId]  active conversation — used to persist
 *                                   the validation bubble in the DB so it
 *                                   survives page reloads.
 */
export const uploadRegistrationPdf = (file, conversationId) => {
    const formData = new FormData();
    formData.append('registration', file);
    if (conversationId) {
        formData.append('conversationId', conversationId);
    }
    return api.post('/chat/upload-registration', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export default api;