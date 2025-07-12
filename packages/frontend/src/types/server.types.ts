// src/types/server.types.ts

import type { User, UserStatus } from './auth.types'; // or adjust if User is elsewhere

export interface Server {
  id: string;
  name: string;
  description?: string;
  ownerId?: string;       // optional, user who created the server
  createdAt?: string;     // ISO date string
  updatedAt?: string;
  channels: Channel[]; // list of channels in the server
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: ChannelType;
  serverId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ChannelType = {
  TEXT: 'text',
  VOICE: 'voice',
  CATEGORY: 'category',
} as const;

export type ChannelType = typeof ChannelType[keyof typeof ChannelType];


export interface ServerMember {
  id: string; // membership id
  user: User;
  serverId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  status: UserStatus
}
