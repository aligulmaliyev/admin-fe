/* eslint-disable react-refresh/only-export-components */
import { endpoints } from "@/common/api/endpoints";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Statuses } from "@/constants/statuses";

interface User {
  id: number;
  username: string;
  name: string;
  accountStatus: keyof typeof Statuses;
  roles: string[];
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user") || null;
    if (user) {
      setUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post(`${BASE_URL}${endpoints.auth.login}`, {
        username,
        password,
      });

      console.log(response);
      if (!response.data) return false;

      const { user, access_token } = response.data;

      setUser(user);
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
