import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/User';
import * as authService from "../services/AuthService"
import { fetchAllUsers } from "../services/UserService"
import MySwal from '../config/MySwal';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  login: (data: any) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkJWT = async () => {
    try {
      await fetchAllUsers();
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    } catch (e: any) {
      MySwal.fire({
        title: "Error!",
        text: "User session expired please login again",
        icon: "error"
      })
    }
  }

  useEffect(() => {
    // Simulate checking auth state
    checkJWT();

  }, []);

  const login = async (data: any) => {
    return await authService.login(data);
  };

  const register = async (data: any) => {
    return await authService.register(data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};