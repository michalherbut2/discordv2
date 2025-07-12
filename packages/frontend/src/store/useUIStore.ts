// store/useUIStore.ts
import { create } from 'zustand'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  duration?: number
}

interface UIStore {
  isModalOpen: boolean
  modalType: string | null
  modalData: any
  isSidebarOpen: boolean
  isTyping: boolean
  typingUsers: string[]
  notifications: Notification[]
  
  // Modal actions
  openModal: (type: string, data?: any) => void
  closeModal: () => void
  
  // Sidebar actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  
  // Typing actions
  setTyping: (typing: boolean) => void
  addTypingUser: (userId: string) => void
  removeTypingUser: (userId: string) => void
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'title'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  isModalOpen: false,
  modalType: null,
  modalData: null,
  isSidebarOpen: true,
  isTyping: false,
  typingUsers: [],
  notifications: [],
  
  // Modal actions
  openModal: (type, data) => {
    set({
      isModalOpen: true,
      modalType: type,
      modalData: data
    })
  },
  
  closeModal: () => {
    set({
      isModalOpen: false,
      modalType: null,
      modalData: null
    })
  },
  
  // Sidebar actions
  toggleSidebar: () => {
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen
    }))
  },
  
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  
  // Typing actions
  setTyping: (typing) => set({ isTyping: typing }),
  
  addTypingUser: (userId) => {
    set((state) => ({
      typingUsers: [...state.typingUsers.filter(id => id !== userId), userId]
    }))
  },
  
  removeTypingUser: (userId) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter(id => id !== userId)
    }))
  },
  
  // Notification actions
  addNotification: (notification) => {
    const fullNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    }
    
    set((state) => ({
      notifications: [...state.notifications, fullNotification]
    }))
    
    // Auto-remove notification after duration (if specified)
    if (notification.duration) {
      setTimeout(() => {
        get().removeNotification(fullNotification.id)
      }, notification.duration)
    }
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }))
  },
  
  clearNotifications: () => set({ notifications: [] })
}))

export type { Notification };