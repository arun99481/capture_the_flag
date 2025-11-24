"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SignupPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const link_1 = __importDefault(require("next/link"));
const api_1 = require("@/lib/api");
function SignupPage() {
    const [name, setName] = (0, react_1.useState)("");
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }
            // Store token and user
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            // Set auth token for API calls
            (0, api_1.setAuthToken)(data.token);
            // Redirect to home
            router.push("/");
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">TartanCTF</h1>
                    <p className="text-gray-400">Create your account</p>
                </div>

                <card_1.Card>
                    <card_1.CardHeader>
                        <card_1.CardTitle>Sign Up</card_1.CardTitle>
                        <card_1.CardDescription>Get started with TartanCTF</card_1.CardDescription>
                    </card_1.CardHeader>
                    <card_1.CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (<div className="p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
                                    {error}
                                </div>)}

                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Name
                                </label>
                                <input_1.Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required/>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <input_1.Input id="email" type="email" placeholder="student@cmu.edu" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    Password
                                </label>
                                <input_1.Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}/>
                            </div>

                            <button_1.Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating account..." : "Sign Up"}
                            </button_1.Button>

                            <p className="text-center text-sm text-gray-500">
                                Already have an account?{" "}
                                <link_1.default href="/login" className="text-blue-500 hover:underline">
                                    Sign in
                                </link_1.default>
                            </p>
                        </form>
                    </card_1.CardContent>
                </card_1.Card>
            </div>
        </div>);
}
