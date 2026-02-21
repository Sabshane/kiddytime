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
    const checkAuthStatus = async () => {
      try {
        // Check if password exists
        const hasPwd = await StorageService.hasPassword();
        setHasPassword(hasPwd);
        
        // Check if user has an active session
        if (hasPwd) {
          const authStatus = await StorageService.checkAuth();
          setIsAuthenticated(authStatus);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
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
