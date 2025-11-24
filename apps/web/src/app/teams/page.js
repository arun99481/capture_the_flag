"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeamsPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const api_1 = require("@/lib/api");
function TeamsContent() {
    var _a;
    const [user, setUser] = (0, react_1.useState)(null);
    const [teamName, setTeamName] = (0, react_1.useState)("");
    const [joinCode, setJoinCode] = (0, react_1.useState)("");
    const [eventId, setEventId] = (0, react_1.useState)("");
    const [myTeam, setMyTeam] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)("");
    const [success, setSuccess] = (0, react_1.useState)("");
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    (0, react_1.useEffect)(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
            return;
        }
        setUser(JSON.parse(storedUser));
        // Get eventId from query params
        const eventIdParam = searchParams.get("eventId");
        if (eventIdParam && eventIdParam !== "undefined") {
            setEventId(eventIdParam);
            fetchMyTeam(eventIdParam);
        }
    }, [searchParams, router]);
    const fetchMyTeam = async (eventId) => {
        try {
            const response = await api_1.api.get(`/teams/my-team?eventId=${eventId}`);
            setMyTeam(response.data);
        }
        catch (err) {
            // No team found is okay
            console.log("No team found for this event");
        }
    };
    const handleCreateTeam = async (e) => {
        var _a, _b;
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const response = await api_1.api.post("/teams", {
                name: teamName,
                eventId: eventId,
            });
            setMyTeam(response.data);
            setSuccess(`Team "${teamName}" created! Invite code: ${response.data.joinCode}`);
            setTeamName("");
        }
        catch (err) {
            setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to create team");
        }
        finally {
            setLoading(false);
        }
    };
    const handleJoinTeam = async (e) => {
        var _a, _b;
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const response = await api_1.api.post("/teams/join", {
                joinCode: joinCode,
            });
            setMyTeam(response.data);
            setSuccess(`Successfully joined team "${response.data.name}"!`);
            setJoinCode("");
        }
        catch (err) {
            setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Failed to join team");
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        (0, api_1.setAuthToken)(null);
        router.push("/login");
    };
    if (!user) {
        return <div>Loading...</div>;
    }
    return (<div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex">
                        <link_1.default href="/" className="mr-6 flex items-center space-x-2">
                            <span className="hidden font-bold sm:inline-block text-cmu-red text-xl">
                                TartanCTF
                            </span>
                        </link_1.default>
                    </div>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <nav className="flex items-center space-x-6">
                            <link_1.default href="/events" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60">
                                Events
                            </link_1.default>

                            <span className="text-sm text-muted-foreground">
                                Welcome, {user.name}
                            </span>
                            <button_1.Button variant="outline" size="sm" onClick={handleLogout}>
                                Logout
                            </button_1.Button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto py-10 flex-1">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Team Management</h1>

                    {error && (<div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded text-red-500">
                            {error}
                        </div>)}

                    {success && (<div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded text-green-500">
                            {success}
                        </div>)}

                    {/* Current Team */}
                    {myTeam && (<card_1.Card className="mb-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                            <card_1.CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <card_1.CardTitle className="text-2xl">Your Current Team</card_1.CardTitle>
                                    <card_1.CardDescription>You're all set!</card_1.CardDescription>
                                </div>
                                <button_1.Button variant="outline" size="sm" onClick={() => fetchMyTeam(eventId)}>
                                    Refresh Status
                                </button_1.Button>
                            </card_1.CardHeader>
                            <card_1.CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Team Name</p>
                                    <p className="text-2xl font-bold">{myTeam.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Invite Code</p>
                                    <p className="text-xl font-mono bg-background/50 p-2 rounded inline-block">
                                        {myTeam.joinCode}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">Team Members</p>
                                    <div className="space-y-2">
                                        {((_a = myTeam.members) === null || _a === void 0 ? void 0 : _a.map((member) => (<div key={member.id} className="flex items-center gap-2 text-sm">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                {member.user.name} ({member.user.email})
                                            </div>))) || <p className="text-sm text-muted-foreground">No members yet</p>}
                                    </div>
                                </div>
                                {eventId && (<link_1.default href={`/game/${eventId}`}>
                                        <button_1.Button className="w-full" size="lg">
                                            Start Playing →
                                        </button_1.Button>
                                    </link_1.default>)}
                            </card_1.CardContent>
                        </card_1.Card>)}

                    {/* Create or Join Team */}
                    {!myTeam && (<div className="grid md:grid-cols-2 gap-6">
                            {/* Create Team */}
                            <card_1.Card>
                                <card_1.CardHeader>
                                    <card_1.CardTitle>Create a Team</card_1.CardTitle>
                                    <card_1.CardDescription>Start a new team for this event</card_1.CardDescription>
                                </card_1.CardHeader>
                                <card_1.CardContent>
                                    <form onSubmit={handleCreateTeam} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="teamName" className="text-sm font-medium">
                                                Team Name
                                            </label>
                                            <input_1.Input id="teamName" placeholder="Awesome Team" value={teamName} onChange={(e) => setTeamName(e.target.value)} required/>
                                        </div>
                                        <button_1.Button type="submit" className="w-full" disabled={loading || !eventId}>
                                            {loading ? "Creating..." : "Create Team"}
                                        </button_1.Button>
                                        {!eventId && (<p className="text-sm text-yellow-500">
                                                ⚠️ Please select an event first
                                            </p>)}
                                    </form>
                                </card_1.CardContent>
                            </card_1.Card>

                            {/* Join Team */}
                            <card_1.Card>
                                <card_1.CardHeader>
                                    <card_1.CardTitle>Join a Team</card_1.CardTitle>
                                    <card_1.CardDescription>Enter an invite code to join</card_1.CardDescription>
                                </card_1.CardHeader>
                                <card_1.CardContent>
                                    <form onSubmit={handleJoinTeam} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="joinCode" className="text-sm font-medium">
                                                Invite Code
                                            </label>
                                            <input_1.Input id="joinCode" placeholder="ABC123" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} required/>
                                        </div>
                                        <button_1.Button type="submit" className="w-full" disabled={loading} variant="secondary">
                                            {loading ? "Joining..." : "Join Team"}
                                        </button_1.Button>
                                    </form>
                                </card_1.CardContent>
                            </card_1.Card>
                        </div>)}

                    {/* Back Button */}
                    <div className="mt-8">
                        <link_1.default href="/events">
                            <button_1.Button variant="outline">← Back to Events</button_1.Button>
                        </link_1.default>
                    </div>
                </div>
            </div>
        </div>);
}
function TeamsPage() {
    return (<react_1.Suspense fallback={<div>Loading...</div>}>
            <TeamsContent />
        </react_1.Suspense>);
}
