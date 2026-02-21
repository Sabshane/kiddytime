import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageService } from '../services/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  hasPassword: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  setPassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPassword = async () => {
      const hasPwd = await StorageService.hasPassword();
      setHasPassword(hasPwd);
      setLoading(false);
    };
    checkPassword();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    const isValid = await StorageService.verifyPassword(password);
    if (isValid) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const setPassword = async (password: string) => {
    await StorageService.setPassword(password);
    setHasPassword(true);
    setIsAuthenticated(true);
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, hasPassword, login, logout, setPassword }}>
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
