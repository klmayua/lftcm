import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiResponse } from './api';

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  orgId: string;
  orgName: string;
  branchId?: string;
  branchName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  branchId: string;
}

// Storage keys
const TOKEN_KEY = 'lftcm_access_token';
const REFRESH_KEY = 'lftcm_refresh_token';
const USER_KEY = 'lftcm_user';

// Token management
export function setTokens(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function getTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;
  const accessToken = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// API calls
export async function login(credentials: LoginCredentials): Promise<{ user: User } & AuthTokens> {
  const response = await apiClient<{ user: User } & AuthTokens>('/auth/login', {
    method: 'POST',
    body: credentials,
  });

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Login failed');
  }

  const { user, accessToken, refreshToken } = response.data;
  setTokens({ accessToken, refreshToken });
  setUser(user);

  return response.data;
}

export async function register(data: RegisterData): Promise<{ user: User } & AuthTokens> {
  const response = await apiClient<{ user: User } & AuthTokens>('/auth/register', {
    method: 'POST',
    body: data,
  });

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Registration failed');
  }

  const { user, accessToken, refreshToken } = response.data;
  setTokens({ accessToken, refreshToken });
  setUser(user);

  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient('/auth/logout', { method: 'POST' });
  } finally {
    clearTokens();
  }
}

export async function refreshAccessToken(): Promise<AuthTokens> {
  const tokens = getTokens();
  if (!tokens) {
    throw new Error('No refresh token available');
  }

  const response = await apiClient<AuthTokens>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken: tokens.refreshToken },
  });

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Token refresh failed');
  }

  setTokens(response.data);
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient<{ user: User }>('/auth/me');

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to get user');
  }

  setUser(response.data.user);
  return response.data.user;
}

// React Hook for auth state
export function useAuth() {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = getUser();
    const tokens = getTokens();

    if (storedUser && tokens) {
      setUserState(storedUser);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  const loginUser = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data = await login(credentials);
      setUserState(data.user);
      setIsAuthenticated(true);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const result = await register(data);
      setUserState(result.user);
      setIsAuthenticated(true);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logoutUser = useCallback(async () => {
    setIsLoading(true);
    try {
      await logout();
    } finally {
      setUserState(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      setUserState(user);
      setIsAuthenticated(true);
      return user;
    } catch {
      setUserState(null);
      setIsAuthenticated(false);
      clearTokens();
      return null;
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    refresh: refreshUser,
  };
}
