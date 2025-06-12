// src/lib/api.js
export const api = async (
  url,
  opts = {},
  { parseJson = true, includeStatus = false } = {}
) => {
  // Handle external URLs (like AI service)
  const fullUrl = url.startsWith('http') ? url : `http://localhost:8080${url}`;
  
  const res = await fetch(fullUrl, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });

  // Don't redirect to login for auth endpoints
  if (res.status === 401 && !url.includes('/auth/')) {
    window.location.href = "/login";
    return;
  }

  if (!parseJson) return res;

  const data = await res.json();

  return includeStatus ? { status: res.status, data } : data;
};

/* ---------- Authentication ---------- */
export const signIn = (body) => 
  api("/auth/login", { method: "POST", body: JSON.stringify(body) }, { parseJson: false });

/* ---------- Channel Management ---------- */
export const listChannels = () => api("/channels");
export const getAllChannels = () => api("/channels/all", {}, { includeStatus: true });
export const getChannelMembers = (channelId) => 
  api(`/channels/${channelId}/members`, {}, { includeStatus: true });
export const getChannelMessages = (channelId, limit = 50) => 
  api(`/channels/${channelId}/messages?limit=${limit}`, {}, { includeStatus: true });
export const deleteChannel = (channelId) => 
  api(`/channels/${channelId}`, { method: "DELETE" });

/* ---------- User Management ---------- */
export const listUsers = () => api("/users/", {}, { includeStatus: true });
export const addUser = (user) => 
  api("/users/add", { method: "POST", body: JSON.stringify(user) }, { includeStatus: true });
export const updateUser = (userId, user) => 
  api(`/users/${userId}`, { method: "PUT", body: JSON.stringify(user) }, { includeStatus: true });
export const deleteUser = (userId) => 
  api(`/users/delete/${userId}`, { method: "POST" }, { includeStatus: true });

/* ---------- Role Management ---------- */
export const listRoles = () => api("/roles/", {}, { includeStatus: true });
export const addRole = (role) => 
  api("/roles/add", { method: "POST", body: JSON.stringify(role) }, { includeStatus: true });
export const updateRole = (roleId, role) => 
  api(`/roles/${roleId}`, { method: "PUT", body: JSON.stringify(role) }, { includeStatus: true });
export const deleteRole = (roleId) => 
  api(`/roles/delete/${roleId}`, { method: "POST" }, { includeStatus: true });

/* ---------- Message Management ---------- */
export const getAllMessages = (limit = 100) => 
  api(`/messages?channel_id=0&limit=${limit}`, {}, { includeStatus: true });
export const getMessageStats = () => 
  api("/messages/stats", {}, { includeStatus: true });
export const deleteMessage = (messageId) => 
  api(`/messages/${messageId}`, { method: "DELETE" });
export const flagMessage = (messageId, flagged) => 
  api(`/messages/${messageId}/flag`, { 
    method: "POST", 
    body: JSON.stringify({ flagged }) 
  });

/* ---------- Direct Messages ---------- */
export const listRecipients = () => api("/dms/recipients");
export const openDm = (otherId) => api(`/dms/${otherId}`, { method: "POST" });

/* ---------- AI Service Integration ---------- */
export const getAISummary = (text) => 
  api("http://localhost:8001/api/v1/summarize", { 
    method: "POST", 
    body: JSON.stringify({ text }) 
  });
export const getAIChat = (conversation) => 
  api("http://localhost:8001/api/v1/chat", { 
    method: "POST", 
    body: JSON.stringify(conversation) 
  });
export const getSmartReplies = (messages, currentUser) => 
  api("http://localhost:8001/api/v1/smart-replies", { 
    method: "POST", 
    body: JSON.stringify({ 
      recent_messages: messages, 
      current_user: currentUser,
      max_suggestions: 3 
    }) 
  });

/* ---------- Statistics & Analytics ---------- */
export const getDashboardStats = async () => {
  // This would aggregate data from multiple endpoints
  const [users, channels, messages, roles] = await Promise.all([
    listUsers(),
    getAllChannels(),
    getMessageStats(),
    listRoles(),
  ]);
  
  return {
    users: users.data,
    channels: channels.data,
    messages: messages.data,
    roles: roles.data,
  };
};