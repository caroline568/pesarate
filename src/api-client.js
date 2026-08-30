const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "pesarate-token";

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error("Can't reach the PesaRate server. Is the backend running?");
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const authApi = {
  register: (email, password, name) => request("/auth/register", { method: "POST", body: { email, password, name }, auth: false }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password }, auth: false }),
  google: (credential) => request("/auth/google", { method: "POST", body: { credential }, auth: false }),
  me: () => request("/auth/me"),
  updateProfile: (payload) => request("/auth/me", { method: "PATCH", body: payload }),
  deleteAccount: () => request("/auth/me", { method: "DELETE" }),
};

export const conversionsApi = {
  list: () => request("/conversions"),
  create: (payload) => request("/conversions", { method: "POST", body: payload }),
  update: (id, payload) => request(`/conversions/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => request(`/conversions/${id}`, { method: "DELETE" }),
};

export const tripsApi = {
  list: () => request("/trips"),
  create: (payload) => request("/trips", { method: "POST", body: payload }),
  update: (id, payload) => request(`/trips/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => request(`/trips/${id}`, { method: "DELETE" }),
};

export const alertsApi = {
  list: () => request("/alerts"),
  create: (payload) => request("/alerts", { method: "POST", body: payload }),
  update: (id, payload) => request(`/alerts/${id}`, { method: "PATCH", body: payload }),
  remove: (id) => request(`/alerts/${id}`, { method: "DELETE" }),
};
