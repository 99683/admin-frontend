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
export const openDm        = (otherId)        => api(`/dms/${otherId}`, { method: "POST" });
export const addUser       = (user)           => api("/users/add", { method: "POST", body: JSON.stringify(user)});
