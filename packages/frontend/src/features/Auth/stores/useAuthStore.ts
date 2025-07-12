// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '@/types';
import { authService } from '@/features/Auth/services/auth.service';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthStore extends AuthState {
  // Add token properties
  token: string | null;
  refreshToken: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokenf: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  updateUserStatus: (status: User['status']) => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;

  // Getters
  isLoggedIn: () => boolean;
  getUser: () => User | null;
  getToken: () => string | null; // Add token getter
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
      refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);
          console.log('Login response in useAuthStore:', response);
          
          set({
            user: response.user,
            token: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Store tokens in localStorage
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.tokens.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refreshToken);
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(credentials);

          set({
            user: response.user,
            token: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Store tokens in localStorage
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.tokens.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refreshToken);
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear state and storage
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // Clear tokens from localStorage
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
      },

      refreshTokenf: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await authService.refreshToken(currentRefreshToken);

          set({
            user: response.user,
            token: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
            isAuthenticated: true,
            error: null,
          });

          // Update tokens in localStorage
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.tokens.accessToken);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refreshToken);
        } catch (error) {
          // Token refresh failed, logout user
          get().logout();
          throw error;
        }
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...userData };
        set({ user: updatedUser });
      },

      updateUserStatus: async (status: User['status']) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          const updatedUser = await authService.updateUserStatus(status);
          set({ user: updatedUser });
        } catch (error) {
          console.error('Failed to update user status:', error);
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        set({ isLoading: true });

        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ 
            user: null, 
            token: null,
            refreshToken: null,
            isAuthenticated: false, 
            isLoading: false 
          });
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
      },

      // Getters
      isLoggedIn: () => get().isAuthenticated && get().user !== null,

      getUser: () => get().user,

      getToken: () => get().token,

      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user) return false;

        // Admin users have all permissions
        if (user.badges?.some((badge) => badge.name === 'admin')) return true;

        // Add more permission logic here based on your requirements
        return true;
      },
    }),
    {
      name: STORAGE_KEYS.USER_DATA,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist tokens in zustand - keep them in localStorage for security
      }),
    }
  )
);