import { ApiResponse } from '../interfaces/api-response.interface';
export declare class ResponseHelper {
    static success<T>(data: T, version?: string): ApiResponse<T>;
    static error(error: string, version?: string): ApiResponse<null>;
}
