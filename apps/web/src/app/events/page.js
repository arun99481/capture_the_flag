"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventsPage;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const api_1 = require("@/lib/api");
function EventsPage() {
    const [events, setEvents] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const token = localStorage.getItem("token");
        if (token) {
            (0, api_1.setAuthToken)(token);
        }
        fetchEvents();
    }, []);
    const fetchEvents = async () => {
        try {
            const response = await api_1.api.get("/events");
            setEvents(response.data);
        }
        catch (error) {
            console.error("Failed to fetch events:", error);
        }
        finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };
    const isEventActive = (event) => {
        const now = new Date();
        const start = new Date(event.eventStartTime);
        const end = new Date(event.eventEndTime);
        return now >= start && now <= end;
    };
    const isRegistrationOpen = (event) => {
        const now = new Date();
        const start = new Date(event.registrationStartTime);
        const end = new Date(event.registrationEndTime);
        return now >= start && now <= end;
    };
    if (loading) {
        return (<div className="container mx-auto py-10">
                <div className="text-center">Loading events...</div>
            </div>);
    }
    return (<div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">CTF Events</h1>
                <p className="text-muted-foreground">
                    Browse and register for upcoming Capture the Flag competitions
                </p>
            </div>

            {events.length === 0 ? (<div className="text-center py-10">
                    <p className="text-muted-foreground">No events available at the moment.</p>
                </div>) : (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (<card_1.Card key={event.id}>
                            <card_1.CardHeader>
                                <card_1.CardTitle>{event.name}</card_1.CardTitle>
                                <card_1.CardDescription>
                                    {formatDate(event.eventStartTime)}
                                    {isEventActive(event) && (<span className="ml-2 text-green-600 font-semibold">● LIVE</span>)}
                                    {!isEventActive(event) && isRegistrationOpen(event) && (<span className="ml-2 text-blue-600 font-semibold">Registration Open</span>)}
                                </card_1.CardDescription>
                            </card_1.CardHeader>
                            <card_1.CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {event.description || "Join this exciting CTF competition!"}
                                </p>
                                <div className="flex gap-2">
                                    <link_1.default href={`/events/${event.id}`} className="flex-1">
                                        <button_1.Button className="w-full">View Details</button_1.Button>
                                    </link_1.default>
                                    <link_1.default href={`/teams?eventId=${event.id}`} className="flex-1">
                                        <button_1.Button variant="outline" className="w-full">Join Team</button_1.Button>
                                    </link_1.default>
                                </div>
                            </card_1.CardContent>
                        </card_1.Card>))}
                </div>)}

            <div className="mt-8">
                <link_1.default href="/">
                    <button_1.Button variant="outline">← Back to Home</button_1.Button>
                </link_1.default>
            </div>
        </div>);
}
