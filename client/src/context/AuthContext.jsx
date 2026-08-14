import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/endpoints.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bp_token");
    if (!token) return setLoading(false);
    authApi
      .me()
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem("bp_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (body) => {
    const d = await authApi.login(body);
    localStorage.setItem("bp_token", d.token);
    setUser(d.user);
  };

  const register = async (body) => {
    const d = await authApi.register(body);
    localStorage.setItem("bp_token", d.token);
    setUser(d.user);
  };

  const logout = () => {
    localStorage.removeItem("bp_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
