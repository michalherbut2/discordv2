// store/useServerStore.ts
import { create } from 'zustand'
import type { Server, Channel, ServerMember, ChannelType } from '@/types'
import { createChannel, fetchChannels } from '@/features/Channel/services/channel.service'

interface ServerStore {
  servers: Server[]
  currentServer: Server | null
  channels: Channel[]
  currentChannel: Channel | null
  serverMembers: Record<string, ServerMember[]>
  typingUsers: Record<string, { userId: string; username: string }[]> // channelId -> typing users
  isLoading: boolean
  error: string | null
  
  // Server actions
  setServers: (servers: Server[]) => void
  setCurrentServer: (server: Server | null) => void
  addServer: (server: Server) => void
  updateServer: (serverId: string, updates: Partial<Server>) => void
  removeServer: (serverId: string) => void
  
  // Channel actions
  setChannels: (channels: Channel[]) => void
  setCurrentChannel: (channel: Channel | null) => void
  addChannel: (channel: Channel) => void
  updateChannel: (channelId: string, updates: Partial<Channel>) => void
  removeChannel: (channelId: string) => void
  createChannel: (serverId: string, channelData: { name: string; description: string; type: ChannelType }) => Promise<void>
  loadChannels: (serverId: string) => Promise<void>
  
  // Member actions
  setServerMembers: (serverId: string, members: ServerMember[]) => void
  addServerMember: (serverId: string, member: ServerMember) => void
  removeServerMember: (serverId: string, memberId: string) => void
  updateUserStatus: (userId: string, status: string) => void
  
  // Typing actions
  addTypingUser: (channelId: string, user: { userId: string; username: string }) => void
  removeTypingUser: (channelId: string, userId: string) => void
  
  // Utility actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Getters
  getServerMembers: (serverId: string) => ServerMember[]
  getTypingUsers: (channelId: string) => { userId: string; username: string }[]
  getCurrentServerChannels: () => Channel[]
}

export const useServerStore = create<ServerStore>((set, get) => ({
  servers: [],
  currentServer: null,
  channels: [],
  currentChannel: null,
  serverMembers: {},
  typingUsers: {},
  isLoading: false,
  error: null,
  
  // Server actions
  setServers: (servers) => set({ servers }),
  setCurrentServer: (server) => set({ currentServer: server }),
  
  addServer: (server) => {
    set((state) => ({
      servers: [...state.servers, server]
    }))
  },
  
  updateServer: (serverId, updates) => {
    set((state) => ({
      servers: state.servers.map(server =>
        server.id === serverId ? { ...server, ...updates } : server
      ),
      currentServer: state.currentServer?.id === serverId
        ? { ...state.currentServer, ...updates }
        : state.currentServer
    }))
  },
  
  removeServer: (serverId) => {
    set((state) => ({
      servers: state.servers.filter(server => server.id !== serverId),
      currentServer: state.currentServer?.id === serverId ? null : state.currentServer
    }))
  },
  
  // Channel actions
  setChannels: (channels) => set({ channels }),
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
  
  addChannel: (channel) => {
    set((state) => ({
      channels: [...state.channels, channel]
    }))
  },
  
  updateChannel: (channelId, updates) => {
    set((state) => ({
      channels: state.channels.map(channel =>
        channel.id === channelId ? { ...channel, ...updates } : channel
      ),
      currentChannel: state.currentChannel?.id === channelId
        ? { ...state.currentChannel, ...updates }
        : state.currentChannel
    }))
  },
  
  removeChannel: (channelId) => {
    set((state) => ({
      channels: state.channels.filter(channel => channel.id !== channelId),
      currentChannel: state.currentChannel?.id === channelId ? null : state.currentChannel
    }))
  },

  loadChannels: async (serverId: string) => {
    set({ isLoading: true, error: null })
    try {
      const channels = await fetchChannels(serverId)
      set({ channels, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load channels',
        isLoading: false 
      })
    }
  },
  
  createChannel: async (serverId: string, channelData: { name: string; description: string; type: ChannelType }) => {
    set({ isLoading: true, error: null })
    try {  
      const newChannel: Channel = await createChannel(serverId, channelData.name, channelData.description, channelData.type)
      
      // Add the new channel to the store
      set((state) => ({
        channels: [...state.channels, newChannel],
        isLoading: false
      }))
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create channel',
        isLoading: false 
      })
      throw error // Re-throw so the component can handle it
    }
  },
  
  // Member actions
  setServerMembers: (serverId, members) => {
    set((state) => ({
      serverMembers: {
        ...state.serverMembers,
        [serverId]: members,
      },
    }))
  },

  addServerMember: (serverId, member) => {
    set((state) => ({
      serverMembers: {
        ...state.serverMembers,
        [serverId]: [...(state.serverMembers[serverId] || []), member],
      },
    }))
  },

  removeServerMember: (serverId, memberId) => {
    set((state) => ({
      serverMembers: {
        ...state.serverMembers,
        [serverId]: (state.serverMembers[serverId] || []).filter(member => member.id !== memberId),
      },
    }))
  },

  updateUserStatus: (userId, status) => {
    set((state) => {
      const newServerMembers = { ...state.serverMembers }
      
      // Update user status in all servers
      Object.keys(newServerMembers).forEach(serverId => {
        newServerMembers[serverId] = newServerMembers[serverId].map(member =>
          member.id === userId ? { ...member, status } : member
        )
      })
      
      return { serverMembers: newServerMembers }
    })
  },
  
  // Typing actions
  addTypingUser: (channelId, user) => {
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [channelId]: [
          ...(state.typingUsers[channelId] || []).filter(u => u.userId !== user.userId),
          user
        ]
      }
    }))
  },

  removeTypingUser: (channelId, userId) => {
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [channelId]: (state.typingUsers[channelId] || []).filter(u => u.userId !== userId)
      }
    }))
  },
  
  // Utility actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  // Getters
  getServerMembers: (serverId) => {
    const state = get()
    return state.serverMembers[serverId] || []
  },

  getTypingUsers: (channelId) => {
    const state = get()
    return state.typingUsers[channelId] || []
  },

  getCurrentServerChannels: () => {
    const state = get()
    return state.channels.filter(channel => 
      channel.serverId === state.currentServer?.id
    )
  }
}))