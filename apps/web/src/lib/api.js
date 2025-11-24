"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
exports.setAuthToken = setAuthToken;
const axios_1 = __importDefault(require("axios"));
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
exports.api = axios_1.default.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Load token from localStorage if available
if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
        exports.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}
// Helper function to set auth token
function setAuthToken(token) {
    if (token) {
        exports.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else {
        delete exports.api.defaults.headers.common['Authorization'];
    }
}
