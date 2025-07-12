// packages/frontend/src/types/auth.types.ts
 
import type { BaseEntity } from './index';

export interface User extends BaseEntity {
  username: string;
  email: string;
  avatar?: string;
  displayName?: string;
  status: UserStatus;
  customStatus?: string;
  isOnline: boolean;
  lastSeen: Date;
  isBot: boolean;
  verified: boolean;
  badges: UserBadge[];
  // token: string;
  user: User; // This is a self-reference to the User type
}

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const UserStatus = {
  ONLINE: 'online',
  AWAY: 'away',
  IDLE: 'idle',
  DO_NOT_DISTURB: 'dnd',
  INVISIBLE: 'invisible',
  BUSY: 'busy',
  OFFLINE: 'offline',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// old
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}
