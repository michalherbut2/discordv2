// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// WebSocket Configuration
export const SOCKET_CONFIG = {
  URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001',
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 2000,
  RECONNECTION_DELAY_MAX: 5000,
  TIMEOUT: 20000,
} as const;

// Application Limits
export const LIMITS = {
  MESSAGE_LENGTH: 2000,
  USERNAME_LENGTH: 32,
  SERVER_NAME_LENGTH: 100,
  CHANNEL_NAME_LENGTH: 100,
  TOPIC_LENGTH: 1024,
  FILE_SIZE: 8 * 1024 * 1024, // 8MB
  ATTACHMENT_COUNT: 10,
  EMBED_COUNT: 10,
  REACTION_COUNT: 20,
  MENTION_COUNT: 50,
} as const;

// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 240,
  MEMBER_LIST_WIDTH: 240,
  HEADER_HEIGHT: 48,
  MESSAGE_INPUT_HEIGHT: 68,
  ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  TYPING_TIMEOUT: 10000,
  INFINITE_SCROLL_THRESHOLD: 0.8,
} as const;

// Theme Colors
export const COLORS = {
  PRIMARY: '#5865F2',
  SECONDARY: '#4752C4',
  SUCCESS: '#57F287',
  WARNING: '#FEE75C',
  DANGER: '#ED4245',
  INFO: '#00AFF4',
  DARK: {
    PRIMARY: '#36393f',
    SECONDARY: '#2f3136',
    TERTIARY: '#40444b',
    TEXT: '#dcddde',
    MUTED: '#8e9297',
  },
  LIGHT: {
    PRIMARY: '#ffffff',
    SECONDARY: '#f2f3f5',
    TERTIARY: '#e3e5e8',
    TEXT: '#2e3338',
    MUTED: '#4f5660',
  },
} as const;

// File Types
export const FILE_TYPES = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  VIDEOS: ['mp4', 'webm', 'mov', 'avi', 'mkv'],
  AUDIO: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
  ARCHIVES: ['zip', 'rar', '7z', 'tar', 'gz'],
} as const;

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,32}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  // URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, // unnecessary escape character
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  MENTION: /<@!?(\d+)>/g,
  CHANNEL_MENTION: /<#(\d+)>/g,
  ROLE_MENTION: /<@&(\d+)>/g,
  EMOJI: /<a?:(\w+):(\d+)>/g,
  CUSTOM_EMOJI: /^:[a-zA-Z0-9_]+:$/,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  NOTIFICATION_SETTINGS: 'notification_settings',
  DRAFT_MESSAGES: 'draft_messages',
  COLLAPSED_CATEGORIES: 'collapsed_categories',
  SIDEBAR_STATE: 'sidebar_state',
  VOLUME_SETTINGS: 'volume_settings',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    PROFILE: '/users/profile',
    STATUS: '/users/status',
    AVATAR: '/users/avatar',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
  FILE_TOO_LARGE: 'File size exceeds the limit.',
  INVALID_FILE_TYPE: 'Invalid file type.',
  CONNECTION_LOST: 'Connection lost. Attempting to reconnect...',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  MESSAGE_SENT: 'Message sent!',
  FILE_UPLOADED: 'File uploaded successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  SERVER_CREATED: 'Server created successfully!',
  CHANNEL_CREATED: 'Channel created successfully!',
  MEMBER_INVITED: 'Member invited successfully!',
} as const;

// Permissions
export const PERMISSIONS = {
  CREATE_INSTANT_INVITE: 1n << 0n,
  KICK_MEMBERS: 1n << 1n,
  BAN_MEMBERS: 1n << 2n,
  ADMINISTRATOR: 1n << 3n,
  MANAGE_CHANNELS: 1n << 4n,
  MANAGE_GUILD: 1n << 5n,
  ADD_REACTIONS: 1n << 6n,
  VIEW_AUDIT_LOG: 1n << 7n,
  PRIORITY_SPEAKER: 1n << 8n,
  STREAM: 1n << 9n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  SEND_TTS_MESSAGES: 1n << 12n,
  MANAGE_MESSAGES: 1n << 13n,
  EMBED_LINKS: 1n << 14n,
  ATTACH_FILES: 1n << 15n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_EXTERNAL_EMOJIS: 1n << 18n,
  VIEW_GUILD_INSIGHTS: 1n << 19n,
  CONNECT: 1n << 20n,
  SPEAK: 1n << 21n,
  MUTE_MEMBERS: 1n << 22n,
  DEAFEN_MEMBERS: 1n << 23n,
  MOVE_MEMBERS: 1n << 24n,
  USE_VAD: 1n << 25n,
  CHANGE_NICKNAME: 1n << 26n,
  MANAGE_NICKNAMES: 1n << 27n,
  MANAGE_ROLES: 1n << 28n,
  MANAGE_WEBHOOKS: 1n << 29n,
  MANAGE_EMOJIS: 1n << 30n,
  USE_APPLICATION_COMMANDS: 1n << 31n,
  REQUEST_TO_SPEAK: 1n << 32n,
  MANAGE_EVENTS: 1n << 33n,
  MANAGE_THREADS: 1n << 34n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  CREATE_PRIVATE_THREADS: 1n << 36n,
  USE_EXTERNAL_STICKERS: 1n << 37n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n,
  USE_EMBEDDED_ACTIVITIES: 1n << 39n,
  MODERATE_MEMBERS: 1n << 40n,
} as const;