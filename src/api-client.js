const BASE = import.meta.env.VITE_API_URL || "/api";
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
    console.error(`Can't reach the PesaRate server at ${BASE}: ${error.message}`);
    throw new Error(`Can't reach the PesaRate server at ${BASE}. Check that the backend is running and VITE_API_URL is set correctly.`, { cause: error });
  }
  if (response.status === 204) return null;
  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
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
  compare: ({ from, to, amount, channel }) =>
    request(`/conversions/compare?from_currency=${encodeURIComponent(from)}&to_currency=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount)}&channel=${encodeURIComponent(channel)}`),
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
