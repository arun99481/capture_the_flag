"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventDetailsPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const api_1 = require("@/lib/api");
function EventDetailsPage() {
    const params = (0, navigation_1.useParams)();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    // In production, fetch event details from API
    const event = {
        id: id,
        title: id === "1" ? "TartanHacks CTF" : "PlaidCTF 2025",
        date: id === "1" ? "Feb 15, 2025" : "Apr 10, 2025",
        description: id === "1"
            ? "A 24-hour beginner friendly CTF event designed for students new to cybersecurity."
            : "The legendary global competition featuring the world's hardest challenges.",
        status: "upcoming",
        teamLimit: 4,
        maxTeams: 50
    };
    (0, react_1.useEffect)(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        (0, api_1.setAuthToken)(null);
        setUser(null);
        router.push("/login");
    };
    const handleRegister = () => {
        if (!user) {
            // Not logged in, redirect to login
            router.push("/login");
            return;
        }
        // Logged in, redirect to teams page to create/join team for this event
        router.push(`/teams?eventId=${id}`);
    };
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

                        </nav>
                        <div className="flex items-center gap-2 ml-4">
                            {user ? (<div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        {user.username || user.email}
                                    </span>
                                    <button_1.Button variant="ghost" size="sm" onClick={handleLogout}>
                                        Logout
                                    </button_1.Button>
                                </div>) : (<link_1.default href="/login">
                                    <button_1.Button size="sm">Login</button_1.Button>
                                </link_1.default>)}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto py-10">
                <div className="max-w-3xl mx-auto">
                    <card_1.Card>
                        <card_1.CardHeader>
                            <card_1.CardTitle className="text-3xl">{event.title}</card_1.CardTitle>
                            <card_1.CardDescription className="text-lg">{event.date}</card_1.CardDescription>
                        </card_1.CardHeader>
                        <card_1.CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground">{event.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Team Size</h3>
                                    <p className="text-muted-foreground">Up to {event.teamLimit} members</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Total Teams</h3>
                                    <p className="text-muted-foreground">Max {event.maxTeams} teams</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button_1.Button size="lg" className="w-full" onClick={handleRegister}>
                                    Join / Create Team
                                </button_1.Button>
                                <link_1.default href={`/events/${id}/leaderboard`}>
                                    <button_1.Button size="lg" variant="secondary" className="w-full">View Leaderboard</button_1.Button>
                                </link_1.default>
                                <link_1.default href="/events">
                                    <button_1.Button size="lg" variant="outline" className="w-full">Back to Events</button_1.Button>
                                </link_1.default>
                            </div>
                        </card_1.CardContent>
                    </card_1.Card>
                </div>
            </main>
        </div>);
}
