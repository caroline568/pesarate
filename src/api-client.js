const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "pesarate-token";
const REMEMBER_KEY = "pesarate-remember";

export function getRememberMe() {
  return localStorage.getItem(REMEMBER_KEY) === "true";
}

export function getToken() {
  const remember = getRememberMe();
  const activeStorage = remember ? localStorage : sessionStorage;
  return activeStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token, remember = false) {
  localStorage.setItem(REMEMBER_KEY, String(Boolean(remember)));
  const activeStorage = remember ? localStorage : sessionStorage;
  const otherStorage = remember ? sessionStorage : localStorage;

  if (token) {
    activeStorage.setItem(TOKEN_KEY, token);
    otherStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch (error) {
    // Provide helpful error message with API URL for debugging
    const errorMsg = `Can't reach the PesaRate server at ${BASE}. Is the backend running? ${error.message}`;
    console.error(errorMsg);
    throw new Error("Can't reach the PesaRate server. Is the backend running?");
  }
  if (response.status === 204) return null;
  
  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error(`Failed to parse JSON response from ${path}:`, response.status, response.statusText);
    // If the server returns HTML (error page), it's a server error
    if (response.status >= 500) {
      throw new Error("Something went wrong on our end. Please try again.");
    }
    throw new Error("Invalid response from server. Please try again.");
  }
  
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
