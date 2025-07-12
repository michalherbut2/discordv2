// package/frontend/src/services/api.ts

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '@/utils/constants';
import type { ApiResponse, ApiError } from '@/types';

class ApiService {
  private instance: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (token expired)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.refreshPromise = this.instance
      .post('/auth/refresh', { refreshToken })
      .then((response) => {
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        
        this.refreshPromise = null;
        return accessToken;
      })
      .catch((error) => {
        this.refreshPromise = null;
        throw error;
      });

    return this.refreshPromise;
  }

  private handleAuthError() {
    // Clear tokens
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // Redirect to login (you might want to use your router here)
    window.location.href = '/login';
  }

  private handleError(error: any): ApiError {
    const message = error.response?.data?.message || error.message || ERROR_MESSAGES.SERVER_ERROR;
    const code = error.response?.status?.toString() || 'UNKNOWN_ERROR';
    const details = error.response?.data?.details || {};

    return {
      message,
      code,
      details,
    };
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      console.log('Making POST request to:', url);
      console.log('Request data:', data);
      console.log('Request config:', config);
      
      const response: AxiosResponse<ApiResponse<T>> = await this.instance.post(url, data, config);
      console.log('Response in POST request:', response);
      // console.log('Response data:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.log('Error in POST request:', error);
      throw this.handleError(error); // 🔥 ADD THIS

    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.instance.delete(url, config);
    return response.data;
  }

  // File upload
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response: AxiosResponse<ApiResponse<any>> = await this.instance.post(
      '/upload',
      formData,
      config
    );
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  clearAuthToken() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Request cancellation
  createCancelToken() {
    return axios.CancelToken.source();
  }

  isCancel(error: any): boolean {
    return axios.isCancel(error);
  }
}

export const apiService = new ApiService();
export default apiService;