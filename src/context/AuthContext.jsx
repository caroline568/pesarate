import { useState, useEffect, useCallback } from "react";
import { authApi, getToken, setToken } from "../api-client";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() => (getToken() ? "loading" : "signed-out"));

  useEffect(() => {
    if (!getToken()) return;
    authApi
      .me()
      .then((d) => {
        setUser(d.user);
        setStatus("signed-in");
      })
      .catch(() => {
        setToken(null);
        setStatus("signed-out");
      });
  }, []);

  const login = useCallback(async (email, password) => {
    const d = await authApi.login(email, password);
    setToken(d.token);
    setUser(d.user);
    setStatus("signed-in");
  }, []);

  const register = useCallback(async (email, password, name) => {
    const d = await authApi.register(email, password, name);
    setToken(d.token);
    setUser(d.user);
    setStatus("signed-in");
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setStatus("signed-out");
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
