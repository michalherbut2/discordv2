
// packages/backend/src/common/interfaces/api-response.interface.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
  version: string;
}