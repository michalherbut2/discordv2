"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHttpError = exports.handleSocketError = exports.getErrorMessage = void 0;
const getErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    }
    return 'An unknown error occurred';
};
exports.getErrorMessage = getErrorMessage;
const handleSocketError = (error, client, event = 'error') => {
    const message = (0, exports.getErrorMessage)(error);
    client.emit(event, { message });
    console.error('Socket error:', error);
};
exports.handleSocketError = handleSocketError;
const handleHttpError = (error) => {
    const message = (0, exports.getErrorMessage)(error);
    if (error instanceof Error) {
        if (error.name === 'ValidationError') {
            return { message, statusCode: 400 };
        }
        if (error.name === 'UnauthorizedError') {
            return { message, statusCode: 401 };
        }
    }
    return { message, statusCode: 500 };
};
exports.handleHttpError = handleHttpError;
//# sourceMappingURL=error.helper.js.map