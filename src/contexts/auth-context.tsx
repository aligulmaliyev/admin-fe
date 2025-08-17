/* eslint-disable react-refresh/only-export-components */
import { endpoints } from "@/common/api/endpoints";
import { BASE_URL } from "@/constants/api";
import axios from "axios";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Statuses } from "@/constants/statuses";

interface IUser {
  id: number;
  username: string;
  email: string;
  name: string;
  accountStatus: keyof typeof Statuses;
  roles: string[];
  token: string;
}

interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${BASE_URL}${endpoints.auth.login}`, {
        email,
        password,
      });

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
    finally {
      setIsLoading(false)
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

    useEffect(() => {
    const user = localStorage.getItem("user") || null;
    if (user) {
      setUser(JSON.parse(user));
    }
    setIsLoading(false)
  }, []);

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
