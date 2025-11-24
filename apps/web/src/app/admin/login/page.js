"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminLoginPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const card_1 = require("@/components/ui/card");
const api_1 = require("@/lib/api");
function AdminLoginPage() {
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    const handleLogin = async (e) => {
        var _a, _b;
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await api_1.api.post("/auth/login", { email, password });
            const { token, user } = response.data;
            if (user.role !== "ADMIN") {
                setError("Access denied. Admin privileges required.");
                setLoading(false);
                return;
            }
            (0, api_1.setAuthToken)(token);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            router.push("/admin/dashboard");
        }
        catch (err) {
            setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Login failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="flex min-h-screen items-center justify-center bg-muted/50">
            <card_1.Card className="w-full max-w-md">
                <card_1.CardHeader className="space-y-1">
                    <card_1.CardTitle className="text-2xl font-bold">Admin Login</card_1.CardTitle>
                    <card_1.CardDescription>
                        Enter your credentials to access the admin dashboard
                    </card_1.CardDescription>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email">Email</label>
                            <input_1.Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password">Password</label>
                            <input_1.Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </div>
                        {error && (<div className="text-sm text-red-500 font-medium">
                                {error}
                            </div>)}
                        <button_1.Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button_1.Button>
                    </form>
                </card_1.CardContent>
            </card_1.Card>
        </div>);
}
