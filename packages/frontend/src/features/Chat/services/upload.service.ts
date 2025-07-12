import { api } from './api'
import { ApiResponse } from '../types'

interface UploadResponse {
  url: string
  filename: string
  originalName: string
  size: number
  mimeType: string
}

export const uploadService = {
  uploadImage: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  uploadFile: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  uploadAvatar: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}