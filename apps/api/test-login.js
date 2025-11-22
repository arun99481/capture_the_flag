"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function main() {
    const url = 'http://localhost:3001/api/auth/login';
    const email = 'student@cmu.edu';
    const password = 'password';
    console.log(`Attempting login to ${url} with email ${email}...`);
    try {
        const response = await axios_1.default.post(url, {
            email,
            password
        });
        console.log('Login successful!');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    }
    catch (error) {
        console.error('Login failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        else {
            console.error('Error:', error.message);
        }
    }
}
main();
//# sourceMappingURL=test-login.js.map