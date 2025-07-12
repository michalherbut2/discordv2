"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    data;
    error;
    timestamp;
    version;
    constructor(data, error) {
        this.success = !error;
        this.data = data;
        this.error = error;
        this.timestamp = new Date().toISOString();
        this.version = '1.0.0';
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=response.dto.js.map