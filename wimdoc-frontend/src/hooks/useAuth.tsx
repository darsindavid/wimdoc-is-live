import React, { createContext, useContext, useEffect, useState } from "react";

type UserRole = "admin" | "user";

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  username: string | null;
  token: string | null;
  loading: boolean;
  login: (token: string, role: UserRole, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load saved session
  useEffect(() => {
    const saved = localStorage.getItem("wimdoc-auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      setToken(parsed.token);
      setRole(parsed.role);
      setUsername(parsed.username);
    }
    setLoading(false);
  }, []);

  function login(tk: string, rl: UserRole, uname: string) {
    const payload = { token: tk, role: rl, username: uname };

    localStorage.setItem("wimdoc-auth", JSON.stringify(payload));

    setToken(tk);
    setRole(rl);
    setUsername(uname);
  }

  function logout() {
    localStorage.removeItem("wimdoc-auth");
    setToken(null);
    setRole(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        role,
        username,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}