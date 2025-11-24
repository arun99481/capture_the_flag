"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3001/api';
async function main() {
    var _a;
    const email = `test${Date.now()}@test.com`;
    const password = 'password';
    const name = 'Test User';
    console.log(`1. Signing up as ${email}...`);
    try {
        await axios_1.default.post(`${API_URL}/auth/signup`, { email, password, name });
    }
    catch (e) {
        console.log('Signup failed (maybe already exists):', e.message);
        // Try login
    }
    console.log('2. Logging in...');
    const loginRes = await axios_1.default.post(`${API_URL}/auth/login`, { email, password });
    const token = loginRes.data.token;
    const user = loginRes.data.user;
    console.log('Logged in as:', user.id);
    const axiosAuth = axios_1.default.create({
        baseURL: API_URL,
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('3. Creating Team...');
    const teamName = `Team ${Date.now()}`;
    const eventId = '1';
    const teamRes = await axiosAuth.post('/teams', { name: teamName, eventId });
    console.log('Team created:', teamRes.data.name, 'ID:', teamRes.data.id);
    console.log('4. Getting Game Status...');
    const statusRes = await axiosAuth.get(`/game/${eventId}/status`);
    console.log('Current Level:', statusRes.data.currentLevel);
    console.log('5. Solving Level 1...');
    // Generate expected flag locally
    const { createHash } = require('crypto');
    const seed = `${teamRes.data.id}-1-tartan-secret`;
    const hash = createHash('sha256').update(seed).digest('hex').substring(0, 8).toUpperCase();
    const flag = `FLAG-{${hash}}`;
    console.log('Generated Flag:', flag);
    console.log('6. Submitting Flag...');
    try {
        const solveRes = await axiosAuth.post(`/game/${eventId}/level/1/solve`, { password: flag });
        console.log('Solve Result:', solveRes.data);
    }
    catch (e) {
        console.error('Solve Failed:', ((_a = e.response) === null || _a === void 0 ? void 0 : _a.data) || e.message);
    }
}
main();
