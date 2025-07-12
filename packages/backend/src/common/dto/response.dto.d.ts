export declare class ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
    version: string;
    constructor(data?: T, error?: string);
}
