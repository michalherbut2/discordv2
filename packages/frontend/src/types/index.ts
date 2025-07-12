// packages/frontend/src/types/index.ts




export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];

// Common types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Re-export all types
export * from './auth.types';
export * from './message.types';
export * from './server.types';
export * from './api.types';