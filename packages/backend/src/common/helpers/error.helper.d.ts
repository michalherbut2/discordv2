export declare const getErrorMessage: (error: unknown) => string;
export declare const handleSocketError: (error: unknown, client: any, event?: string) => void;
export declare const handleHttpError: (error: unknown) => {
    message: string;
    statusCode?: number;
};
