// packages/frontend/src/services/message.service.ts

import api from '@/services/api'
import type { Message } from '@/types'

export const messageService = {
  getMessages: async (channelId: string, limit = 50, offset = 0): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/channels/${channelId}/messages`, {
      params: { limit, offset }
    })
    return response.data
  },

  sendMessage: async (channelId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<Message> => {
    const response = await api.post<Message>(`/channels/${channelId}/messages`, {
      content,
      type
    })
    return response.data
  },

  editMessage: async (messageId: string, content: string): Promise<Message> => {
    const response = await api.put<Message>(`/messages/${messageId}`, {
      content
    })
    return response.data
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    const response = await api.delete<void>(`/messages/${messageId}`)
    return response.data
  }
}