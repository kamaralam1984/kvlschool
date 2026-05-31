import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient, setAuthToken, ENDPOINTS } from '../config/api';

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'kvl_auth_token';
const USER_KEY = 'kvl_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);

      if (token && userJson) {
        const user: User = JSON.parse(userJson);
        setAuthToken(token);
        setState({ user, token, isLoading: false, isAuthenticated: true });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  };

  const login = async (email: string, password: string, role: UserRole) => {
    const response = await apiClient.post(ENDPOINTS.LOGIN, { email, password, role });
    const { token, user } = response.data;

    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    setAuthToken(token);

    setState({ user, token, isLoading: false, isAuthenticated: true });
  };

  const logout = async () => {
    try {
      await apiClient.post(ENDPOINTS.LOGOUT);
    } catch {
      // Proceed with local logout even if server call fails
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setAuthToken(null);
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
