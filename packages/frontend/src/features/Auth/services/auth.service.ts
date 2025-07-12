// package/frontend/src/services/auth.service.ts

import { apiService } from '@/services/api';
import type { 
  LoginCredentials, 
  RegisterCredentials, 
  AuthResponse, 
  User,
  UserStatus 
} from '@/types';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/refresh', { refreshToken });
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response.data;
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    const response = await apiService.patch<User>('/auth/me', userData);
    return response.data;
  }

  async updateUserStatus(status: UserStatus): Promise<User> {
    const response = await apiService.patch<User>('/auth/me/status', { status });
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async resetPassword(email: string): Promise<void> {
    await apiService.post('/auth/reset-password', { email });
  }

  async confirmResetPassword(token: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/confirm-reset-password', {
      token,
      newPassword,
    });
  }

  async verifyEmail(token: string): Promise<void> {
    await apiService.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail(): Promise<void> {
    await apiService.post('/auth/resend-verification');
  }

  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    const response = await apiService.post<{ qrCode: string; secret: string }>('/auth/2fa/enable');
    return response.data;
  }

  async confirm2FA(token: string): Promise<void> {
    await apiService.post('/auth/2fa/confirm', { token });
  }

  async disable2FA(token: string): Promise<void> {
    await apiService.post('/auth/2fa/disable', { token });
  }

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiService.post<User>('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteAvatar(): Promise<User> {
    const response = await apiService.delete<User>('/auth/avatar');
    return response.data;
  }

  async getConnections(): Promise<any[]> {
    const response = await apiService.get<any[]>('/auth/connections');
    return response.data;
  }

  async connectAccount(provider: string): Promise<string> {
    const response = await apiService.post<{ url: string }>(`/auth/connect/${provider}`);
    return response.data.url;
  }

  async disconnectAccount(provider: string): Promise<void> {
    await apiService.delete(`/auth/connect/${provider}`);
  }
}

export const authService = new AuthService();
export default authService;