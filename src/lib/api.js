export const api = async (
  url,
  opts = {},
  { parseJson = true, includeStatus = false } = {}
) => {
  const res = await fetch(`http://localhost:8080${url}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });

  if (!parseJson) return res;                    // raw Response as before

  const data = await res.json();                 // parse once here

  return includeStatus ? { status: res.status, data } : data;
};

/* ---------- typed one‑shot helpers ---------- */
export const listChannels  = ()               => api("/channels");
export const listUsers     = ()               => api("/users/", {}, { includeStatus: true });    
export const listRoles     = ()               => api("/roles/", {}, { includeStatus: true });        
export const openDm        = (otherId)        => api(`/dms/${otherId}`, { method: "POST" });
export const addUser       = (user)           => api("/users/add", { method: "POST", body: JSON.stringify(user)}, { includeStatus: true });
export const addRole       = (role)           => api("/roles/add", { method: "POST", body: JSON.stringify(role)}, { includeStatus: true });
export const updateUser    = (userID, user)   => api(`/users/${userID}`, { method: "PUT", body: JSON.stringify(user) }, { includeStatus: true });
export const deleteUser    = (userID)         => api(`/users/delete/${userID}`, { method: "POST" }, { includeStatus: true });
export const updateRole    = (roleID, role)   => api(`/roles/${roleID}`, { method: "PUT", body: JSON.stringify(role) }, { includeStatus: true });
export const deleteRole    = (roleID)         => api(`/roles/delete/${roleID}`, { method: "POST" }, { includeStatus: true });
