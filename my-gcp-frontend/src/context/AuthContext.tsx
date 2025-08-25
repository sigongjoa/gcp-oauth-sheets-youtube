import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (scopes?: string[]) => void;
  logout: () => void;
  setAuthenticated: (status: boolean) => void; // Added for direct status update
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Function to check authentication status with the backend
  const checkSession = async () => {
    try {
      // Make a simple API call to a protected endpoint (e.g., /auth/status)
      // If it succeeds, the user is authenticated.
      // If it fails (e.g., 401), the user is not authenticated.
      const response = await api.get('/auth/status'); // Need to create this endpoint in backend
      if (response.status === 200) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.error('Session check failed:', error);
    }
  };

  useEffect(() => {
    checkSession(); // Check session on initial load
  }, []);

  const login = (scopes?: string[]) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    let authUrl = `${backendUrl}/auth/google`;
    if (scopes && scopes.length > 0) {
      authUrl += `?scopes=${scopes.join(',')}`;
    }
    window.location.href = authUrl;
  };

  const logout = () => {
    // In a real app, you would also call a backend endpoint to clear session
    setIsAuthenticated(false);
    // Optionally redirect to login page
  };

  const setAuthenticated = (status: boolean) => {
    setIsAuthenticated(status);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, setAuthenticated }}>
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