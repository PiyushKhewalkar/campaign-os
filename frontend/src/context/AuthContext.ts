import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI, getAuthToken, setAuthToken, removeAuthToken, getUserData, setUserData, removeUserData, validateToken, isTokenExpired, type User, type SignupData, type SigninData } from '../api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (data: SignupData) => Promise<void>;
  signin: (data: SigninData) => Promise<void>;
  signout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAuthToken();
        const userData = getUserData();
        
        if (token && userData) {
          // Check if token is expired locally first
          if (isTokenExpired(token)) {
            console.log('Token is expired, clearing auth data');
            removeAuthToken();
            removeUserData();
            setUser(null);
          } else {
            // Token appears valid, set user data
            // Note: In production, you might want to validate with backend
            setUser(userData);
          }
        } else {
          // Clear any invalid data
          removeAuthToken();
          removeUserData();
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        // Clear invalid data
        removeAuthToken();
        removeUserData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Periodic token validation
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenValidity = () => {
      const token = getAuthToken();
      if (token && isTokenExpired(token)) {
        handleTokenExpiration();
      }
    };

    // Check token validity every 5 minutes
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.signup(data);
      
      if (response.user) {
        setUser(response.user);
        setUserData(response.user);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (data: SigninData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.signin(data);
      
      if (response.token && response.user) {
        setAuthToken(response.token);
        setUser(response.user);
        setUserData(response.user);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signin failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = () => {
    setUser(null);
    removeAuthToken();
    removeUserData();
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  // Function to handle token expiration
  const handleTokenExpiration = () => {
    console.log('Token expired, signing out user');
    setUser(null);
    removeAuthToken();
    removeUserData();
    setError('Session expired. Please sign in again.');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signup,
    signin,
    signout,
    error,
    clearError,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
