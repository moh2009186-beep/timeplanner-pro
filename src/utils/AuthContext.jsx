import { createContext, useState, useContext, useEffect, useCallback } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const getUsers = useCallback(() => {
    try { return JSON.parse(localStorage.getItem("users") || "[]"); } catch { return []; }
  }, []);

  const register = useCallback((name, email, password) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser = { id: Date.now().toString(), name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem("authUser", JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }, [getUsers]);

  const login = useCallback((email, password) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const safeUser = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem("authUser", JSON.stringify(safeUser));
    setUser(safeUser);
    return safeUser;
  }, [getUsers]);

  const logout = useCallback(() => {
    localStorage.removeItem("authUser");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
