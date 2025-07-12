// packages/frontend/src/types/api.types.ts

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Request Configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Socket Event Types
// export enum SocketEvent {
//   // Connection events
//   CONNECT = 'connect',
//   DISCONNECT = 'disconnect',
//   RECONNECT = 'reconnect',
//   ERROR = 'error',
  
//   // Authentication events
//   AUTHENTICATE = 'authenticate',
//   AUTHENTICATED = 'authenticated',
//   UNAUTHENTICATED = 'unauthenticated',
  
//   // Message events
//   MESSAGE_CREATE = 'message_create',
//   MESSAGE_UPDATE = 'message_update',
//   MESSAGE_DELETE = 'message_delete',
//   MESSAGE_BULK_DELETE = 'message_bulk_delete',
  
//   // Typing events
//   TYPING_START = 'typing_start',
//   TYPING_STOP = 'typing_stop',
  
//   // User events
//   USER_UPDATE = 'user_update',
//   USER_STATUS_UPDATE = 'user_status_update',
//   PRESENCE_UPDATE = 'presence_update',
  
//   // Server events
//   SERVER_CREATE = 'server_create',
//   SERVER_UPDATE = 'server_update',
//   SERVER_DELETE = 'server_delete',
  
//   // Channel events
//   CHANNEL_CREATE = 'channel_create',
//   CHANNEL_UPDATE = 'channel_update',
//   CHANNEL_DELETE = 'channel_delete',
  
//   // Member events
//   MEMBER_JOIN = 'member_join',
//   MEMBER_LEAVE = 'member_leave',
//   MEMBER_UPDATE = 'member_update',
  
//   // Role events
//   ROLE_CREATE = 'role_create',
//   ROLE_UPDATE = 'role_update',
//   ROLE_DELETE = 'role_delete',
  
//   // Voice events
//   VOICE_STATE_UPDATE = 'voice_state_update',
//   VOICE_SERVER_UPDATE = 'voice_server_update',
// }

export const SocketEvent = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  ERROR: 'error',

  // Authentication events
  AUTHENTICATE: 'authenticate',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',

  // Message events
  MESSAGE_CREATE: 'message_create',
  MESSAGE_UPDATE: 'message_update',
  MESSAGE_DELETE: 'message_delete',
  MESSAGE_BULK_DELETE: 'message_bulk_delete',

  // Typing events
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',

  // User events
  USER_UPDATE: 'user_update',
  USER_STATUS_UPDATE: 'user_status_update',
  PRESENCE_UPDATE: 'presence_update',

  // Server events
  SERVER_CREATE: 'server_create',
  SERVER_UPDATE: 'server_update',
  SERVER_DELETE: 'server_delete',

  // Channel events
  CHANNEL_CREATE: 'channel_create',
  CHANNEL_UPDATE: 'channel_update',
  CHANNEL_DELETE: 'channel_delete',

  // Member events
  MEMBER_JOIN: 'member_join',
  MEMBER_LEAVE: 'member_leave',
  MEMBER_UPDATE: 'member_update',

  // Role events
  ROLE_CREATE: 'role_create',
  ROLE_UPDATE: 'role_update',
  ROLE_DELETE: 'role_delete',

  // Voice events
  VOICE_STATE_UPDATE: 'voice_state_update',
  VOICE_SERVER_UPDATE: 'voice_server_update',
} as const;

export type SocketEvent = typeof SocketEvent[keyof typeof SocketEvent];

// WebSocket message format
export interface SocketMessage<T = unknown> {
  event: SocketEvent;
  data: T;
  timestamp: Date;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  url?: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  contentType: string;
}

// Search types
export interface SearchFilters {
  content?: string;
  author?: string;
  mentions?: string;
  has?: ('link' | 'embed' | 'file' | 'video' | 'image' | 'sound')[];
  before?: Date;
  after?: Date;
  during?: Date;
  channelId?: string;
  serverId?: string;
}

export interface SearchResult {
  messages: Array<{
    message: unknown; // Message type
    channel: unknown; // Channel type
    server?: unknown; // Server type
  }>;
  total: number;
  analytics: {
    totalResults: number;
    searchTime: number;
  };
}

// Notification types
export interface NotificationSettings {
  desktop: boolean;
  mobile: boolean;
  email: boolean;
  mentions: boolean;
  directMessages: boolean;
  sounds: boolean;
}

export interface Notification {
  id: string;
  type: 'message' | 'mention' | 'friend_request' | 'server_invite';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data: Record<string, unknown>;
}