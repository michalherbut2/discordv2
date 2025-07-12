// packages/frontend/src/types/message.types.ts

import type { BaseEntity, User } from './index';

export interface Message extends BaseEntity {
  content: string;
  author: User;
  channelId: string;
  serverId: string;
  type: MessageType;
  attachments: MessageAttachment[];
  embeds: MessageEmbed[];
  reactions: MessageReaction[];
  mentions: User[];
  mentionRoles: string[];
  mentionEveryone: boolean;
  pinned: boolean;
  editedAt?: Date;
  replyTo?: Message;
  thread?: MessageThread;
}

// export enum MessageType {
//   DEFAULT = 'default',
//   RECIPIENT_ADD = 'recipient_add',
//   RECIPIENT_REMOVE = 'recipient_remove',
//   CALL = 'call',
//   CHANNEL_NAME_CHANGE = 'channel_name_change',
//   CHANNEL_ICON_CHANGE = 'channel_icon_change',
//   CHANNEL_PINNED_MESSAGE = 'channel_pinned_message',
//   GUILD_MEMBER_JOIN = 'guild_member_join',
//   USER_PREMIUM_GUILD_SUBSCRIPTION = 'user_premium_guild_subscription',
//   SYSTEM = 'system'
// }

export const MessageType = {
  DEFAULT: 'default',
  RECIPIENT_ADD: 'recipient_add',
  RECIPIENT_REMOVE: 'recipient_remove',
  CALL: 'call',
  CHANNEL_NAME_CHANGE: 'channel_name_change',
  CHANNEL_ICON_CHANGE: 'channel_icon_change',
  CHANNEL_PINNED_MESSAGE: 'channel_pinned_message',
  GUILD_MEMBER_JOIN: 'guild_member_join',
  USER_PREMIUM_GUILD_SUBSCRIPTION: 'user_premium_guild_subscription',
  SYSTEM: 'system',
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];

export interface MessageAttachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxyUrl: string;
  height?: number;
  width?: number;
  contentType: string;
}

export interface MessageEmbed {
  title?: string;
  description?: string;
  url?: string;
  timestamp?: Date;
  color?: number;
  footer?: {
    text: string;
    iconUrl?: string;
  };
  image?: {
    url: string;
    height?: number;
    width?: number;
  };
  thumbnail?: {
    url: string;
    height?: number;
    width?: number;
  };
  author?: {
    name: string;
    url?: string;
    iconUrl?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
}

export interface MessageReaction {
  emoji: {
    id?: string;
    name: string;
    animated?: boolean;
  };
  count: number;
  me: boolean;
  users: User[];
}

export interface MessageThread {
  id: string;
  name: string;
  messageCount: number;
  memberCount: number;
  archived: boolean;
  autoArchiveDuration: number;
  archiveTimestamp?: Date;
  locked: boolean;
}

export interface TypingIndicator {
  userId: string;
  channelId: string;
  timestamp: Date;
}

export interface MessageState {
  messages: Record<string, Message[]>; // channelId -> messages
  loading: Record<string, boolean>;
  typingUsers: Record<string, TypingIndicator[]>; // channelId -> typing users
  hasMore: Record<string, boolean>;
}