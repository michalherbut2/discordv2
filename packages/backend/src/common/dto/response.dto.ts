// packages/backend/src/common/dto/response.dto.ts
export class ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  version: string;

  constructor(data?: T, error?: string) {
    this.success = !error;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
    this.version = '1.0.0';
  }
}