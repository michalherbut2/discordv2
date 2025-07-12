// packages/backend/src/common/helpers/error.helper.ts
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  return 'An unknown error occurred';
};

// For Socket.IO specific error handling
export const handleSocketError = (error: unknown, client: any, event = 'error') => {
  const message = getErrorMessage(error);
  client.emit(event, { message });
  
  // Optionally log the error for debugging
  console.error('Socket error:', error);
};

// For HTTP responses
export const handleHttpError = (error: unknown): { message: string; statusCode?: number } => {
  const message = getErrorMessage(error);
  
  // You can add more sophisticated error handling here
  if (error instanceof Error) {
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return { message, statusCode: 400 };
    }
    if (error.name === 'UnauthorizedError') {
      return { message, statusCode: 401 };
    }
  }
  
  return { message, statusCode: 500 };
};