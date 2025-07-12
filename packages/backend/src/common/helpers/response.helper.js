"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
class ResponseHelper {
    static success(data, version = '1.0.0') {
        return {
            success: true,
            data,
            error: null,
            timestamp: new Date().toISOString(),
            version,
        };
    }
    static error(error, version = '1.0.0') {
        return {
            success: false,
            data: null,
            error,
            timestamp: new Date().toISOString(),
            version,
        };
    }
}
exports.ResponseHelper = ResponseHelper;
//# sourceMappingURL=response.helper.js.map