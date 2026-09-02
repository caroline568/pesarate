import { useState, useEffect, useCallback } from "react";
import { authApi, getToken, setToken, getRememberMe } from "../api-client";
import { AuthContext } from "./auth-context";
import { logApiConfig } from "../utils/api-debug";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(() =>
    getToken() ? "loading" : "signed-out"
  );

  useEffect(() => {
    // Log API configuration on app startup (helpful for debugging production deployments)
    logApiConfig();
  }, []);

  useEffect(() => {
    if (!getToken()) return;

    authApi
      .me()
      .then((d) => {
        setUser(d.user);
        setStatus("signed-in");
      })
      .catch(() => {
        setToken(null, getRememberMe());
        setStatus("signed-out");
      });
  }, []);

  const login = useCallback(
    async (email, password, remember = getRememberMe()) => {
      const d = await authApi.login(email, password);
      setToken(d.token, remember);
      setUser(d.user);
      setStatus("signed-in");
    },
    []
  );

  const register = useCallback(
    async (email, password, name, remember = getRememberMe()) => {
      const d = await authApi.register(email, password, name);
      setToken(d.token, remember);
      setUser(d.user);
      setStatus("signed-in");
    },
    []
  );

  const loginWithGoogle = useCallback(
    async (credential, remember = getRememberMe()) => {
      const d = await authApi.google(credential);
      setToken(d.token, remember);
      setUser(d.user);
      setStatus("signed-in");
    },
    []
  );

  const updateProfile = useCallback(
    async (payload) => {
      const d = await authApi.updateProfile(payload);
      setUser(d.user);
      return d.user;
    },
    []
  );

  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount();
    setToken(null, false);
    setUser(null);
    setStatus("signed-out");
  }, []);

  const logout = useCallback(() => {
    setToken(null, false);
    setUser(null);
    setStatus("signed-out");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        login,
        register,
        loginWithGoogle,
        updateProfile,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
