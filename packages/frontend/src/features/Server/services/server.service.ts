// package/frontend/src/services/server.service.ts

import apiService from '@/services/api'
import type { Server, Channel, ServerMember, ApiResponse } from '../types'

export const serverService = {
  getServers: async (): Promise<Server[]> => {
    const response = await apiService.get<Server[]>('/servers')
    return response.data
  },

  getServer: async (serverId: string): Promise<Server> => {
    const response = await apiService.get<Server>(`/servers/${serverId}`)
    return response.data
  },

  createServer: async (name: string, description?: string): Promise<Server> => {
    const response = await apiService.post<Server>('/servers', {
      name,
      description
    })
    return response.data
  },

  updateServer: async (serverId: string, data: Partial<Server>): Promise<Server> => {
    const response = await apiService.put<Server>(`/servers/${serverId}`, data)
    return response.data
  },

  deleteServer: async (serverId: string): Promise<void> => {
    const response = await apiService.delete<void>(`/servers/${serverId}`)
    return response.data
  },

  joinServer: async (serverId: string): Promise<ServerMember> => {
    const response = await apiService.post(`/servers/${serverId}/join`)
    return response.data
  },

  leaveServer: async (serverId: string): Promise<void> => {
    const response = await apiService.post<void>(`/servers/${serverId}/leave`)
    return response.data
  },

  getChannels: async (serverId: string): Promise<Channel[]> => {
    const response = await apiService.get<Channel[]>(`/servers/${serverId}/channels`)
    return response.data
  },

  createChannel: async (serverId: string, name: string, description?: string, type: 'text' | 'voice' = 'text'): Promise<Channel> => {
    const response = await apiService.post<Channel>(`/servers/${serverId}/channels`, {
      name,
      description,
      type
    })
    return response.data
  },

  updateChannel: async (channelId: string, data: Partial<Channel>): Promise<Channel> => {
    const response = await apiService.put<Channel>(`/channels/${channelId}`, data)
    return response.data
  },

  deleteChannel: async (channelId: string): Promise<void> => {
    const response = await apiService.delete<void>(`/channels/${channelId}`)
    return response.data
  },

  getMembers: async (serverId: string): Promise<ServerMember[]> => {
    const response = await apiService.get<ServerMember[]>(`/servers/${serverId}/members`)
    return response.data
  }
}