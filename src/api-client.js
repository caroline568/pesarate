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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Render's free tier spins a sleeping backend down after inactivity, so the
// *first* request after a while can fail to connect even though the server
// is fine — it just hasn't finished waking up yet. Retry a couple of times
// before giving up, instead of surfacing a network blip as a hard failure.
async function fetchWithRetry(url, options, attempts = 3) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (attempt === attempts) throw error;
      await sleep(attempt * 1200);
    }
  }
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetchWithRetry(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    // A thrown fetch (as opposed to a non-2xx response) means the request
    // never reached the server at all: wrong VITE_API_URL, backend not
    // running/deployed, or CORS rejecting the request outright.
    console.error(`Can't reach the PesaRate server at ${BASE}: ${error.message}`);
    throw new Error(`Can't reach the PesaRate server at ${BASE}. Check that the backend is running and VITE_API_URL is set correctly.`);
  }
  if (response.status === 204) return null;
  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    // The server responded but not with JSON — usually a 500 debug page or
    // a proxy/host error page. Surface the status instead of a vague
    // "Request failed" so it's actually diagnosable.
    if (!response.ok) throw new Error(`Server error (${response.status}). Check the backend logs.`);
  }
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
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
