"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const api_1 = require("@/lib/api");
function Home() {
    const [user, setUser] = (0, react_1.useState)(null);
    const [upcomingEvents, setUpcomingEvents] = (0, react_1.useState)([]);
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (token) {
            (0, api_1.setAuthToken)(token);
        }
        // Fetch upcoming events
        fetchUpcomingEvents();
    }, []);
    const fetchUpcomingEvents = async () => {
        try {
            const response = await api_1.api.get("/events");
            const now = new Date();
            // Filter for upcoming/active events and take first 3
            const upcoming = response.data
                .filter((event) => new Date(event.eventEndTime) > now)
                .sort((a, b) => new Date(a.eventStartTime).getTime() - new Date(b.eventStartTime).getTime())
                .slice(0, 3);
            setUpcomingEvents(upcoming);
        }
        catch (error) {
            console.error("Failed to fetch upcoming events:", error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        (0, api_1.setAuthToken)(null);
        setUser(null);
        router.push("/login");
    };
    return (<div className="flex min-h-screen flex-col">
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

                            {user ? (<>
                                    <link_1.default href="/practice" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60">
                                        Practice
                                    </link_1.default>
                                    <span className="text-sm text-muted-foreground">
                                        Welcome, {user.name}
                                    </span>
                                    <button_1.Button variant="outline" size="sm" onClick={handleLogout}>
                                        Logout
                                    </button_1.Button>
                                </>) : (<link_1.default href="/login">
                                    <button_1.Button variant="default" size="sm">Login</button_1.Button>
                                </link_1.default>)}
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                    <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                            Capture the Flag <br className="hidden sm:inline"/>
                            <span className="text-cmu-red">Carnegie Mellon Style</span>
                        </h1>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            Join the ultimate cybersecurity challenge. Solve AI-generated puzzles, crack codes, and climb the leaderboard.
                        </p>
                        <div className="space-x-4">
                            <link_1.default href="/events">
                                <button_1.Button size="lg">View Events</button_1.Button>
                            </link_1.default>
                            {user ? (<link_1.default href="/practice">
                                    <button_1.Button variant="outline" size="lg">Practice</button_1.Button>
                                </link_1.default>) : (<link_1.default href="/about">
                                    <button_1.Button variant="outline" size="lg">Learn More</button_1.Button>
                                </link_1.default>)}
                        </div>
                    </div>
                </section>

                <section className="container py-8 md:py-12 lg:py-24">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
                            Upcoming Events
                        </h2>
                        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                            Register for the next big challenge.
                        </p>
                    </div>
                    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-8">
                        {upcomingEvents.length === 0 ? (<div className="col-span-3 text-center text-muted-foreground">
                                No upcoming events at the moment.
                            </div>) : (upcomingEvents.map((event) => (<card_1.Card key={event.id}>
                                    <card_1.CardHeader>
                                        <card_1.CardTitle>{event.name}</card_1.CardTitle>
                                        <card_1.CardDescription>
                                            {new Date(event.eventStartTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })}
                                        </card_1.CardDescription>
                                    </card_1.CardHeader>
                                    <card_1.CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {event.description || "Join this exciting CTF competition!"}
                                        </p>
                                        <link_1.default href={`/events/${event.id}`}>
                                            <button_1.Button className="w-full">View Details</button_1.Button>
                                        </link_1.default>
                                    </card_1.CardContent>
                                </card_1.Card>)))}
                    </div>
                </section>
            </main>
        </div>);
}
