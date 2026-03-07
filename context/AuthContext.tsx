"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";

type User = {
  person_id: string;
  name: string;
  email: string;
  phone: string;
  person_role: string;
  user_id: string;
  username: string;
  user_role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  reloadUser: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const loadUser = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [apiUrl]);

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout, reloadUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
};
