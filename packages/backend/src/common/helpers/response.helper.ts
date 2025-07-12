// packages/backend/src/common/helpers/response.helper.ts
import { ApiResponse } from '../interfaces/api-response.interface';

export class ResponseHelper {
  static success<T>(data: T, version: string = '1.0.0'): ApiResponse<T> {
    return {
      success: true,
      data,
      error: null,
      timestamp: new Date().toISOString(),
      version,
    };
  }

  static error(error: string, version: string = '1.0.0'): ApiResponse<null> {
    return {
      success: false,
      data: null,
      error,
      timestamp: new Date().toISOString(),
      version,
    };
  }
}