"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api, setAuthToken } from "@/lib/api";

interface Event {
    id: string;
    name: string;
    eventStartTime: string;
    eventEndTime: string;
    registrationStartTime: string;
    registrationEndTime: string;
}

export default function AdminDashboard() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    // Form State
    const [newEvent, setNewEvent] = useState({
        name: "",
        description: "",
        registrationStartTime: "",
        registrationEndTime: "",
        eventStartTime: "",
        eventEndTime: "",
        maxTeams: 50,
        challenges: [] as any[],
    });

    const addChallenge = () => {
        setNewEvent(prev => ({
            ...prev,
            challenges: [
                ...prev.challenges,
                {
                    type: "CHAT",  // Default to CHAT type
                    title: "",
                    description: "",
                    points: 100,
                    difficulty: "Easy",
                    systemPrompt: "",
                    flag: "",
                    hint1: "",
                    hint2: "",
                    hint3: "",
                    hint1Penalty: 0,
                    hint2Penalty: 0,
                    hint3Penalty: 0,
                    // Simulation fields
                    websiteTheme: "bank",
                    module1Name: "Summer Portfolio",
                    module1Content: "",
                    module2Name: "Winter Portfolio",
                    module2Content: "",
                    module3Name: "Spring Portfolio",
                    module3Content: "",
                    lockedModuleIndex: 0,
                    lockedModuleMsg: "",
                    chatbotPrompt: "",
                }
            ]
        }));
    };

    const removeChallenge = (index: number) => {
        const updated = [...newEvent.challenges];
        updated.splice(index, 1);
        setNewEvent({ ...newEvent, challenges: updated });
    };

    const updateChallenge = (index: number, field: string, value: any) => {
        const updated = [...newEvent.challenges];
        updated[index] = { ...updated[index], [field]: value };
        setNewEvent({ ...newEvent, challenges: updated });
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            router.push("/admin/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== "ADMIN") {
            router.push("/");
            return;
        }

        setUser(parsedUser);
        setAuthToken(token);
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get("/events");
            setEvents(response.data);
        } catch (error: any) {
            console.error("Failed to fetch events", error);
            // Check if it's an auth error
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("Your session has expired. Please log in again.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setAuthToken(null);
                router.push("/admin/login");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!newEvent.name.trim()) {
            alert("Event name is required");
            return;
        }
        if (!newEvent.registrationStartTime) {
            alert("Registration start time is required");
            return;
        }
        if (!newEvent.registrationEndTime) {
            alert("Registration end time is required");
            return;
        }
        if (!newEvent.eventStartTime) {
            alert("Event start time is required");
            return;
        }
        if (!newEvent.eventEndTime) {
            alert("Event end time is required");
            return;
        }

        try {
            const payload = {
                ...newEvent,
                registrationStartTime: new Date(newEvent.registrationStartTime).toISOString(),
                registrationEndTime: new Date(newEvent.registrationEndTime).toISOString(),
                eventStartTime: new Date(newEvent.eventStartTime).toISOString(),
                eventEndTime: new Date(newEvent.eventEndTime).toISOString(),
                maxTeams: Number(newEvent.maxTeams),
            };
            await api.post("/events", payload);
            fetchEvents();
            // Reset form
            setNewEvent({
                name: "",
                description: "",
                registrationStartTime: "",
                registrationEndTime: "",
                eventStartTime: "",
                eventEndTime: "",
                maxTeams: 50,
                challenges: [],
            });
            alert("Event created successfully!");
        } catch (error: any) {
            console.error("Create event error:", error);

            // Check if it's an auth error
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert("Your session has expired. Please log in again.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setAuthToken(null);
                router.push("/admin/login");
                return;
            }

            alert(error.response?.data?.message || "Failed to create event");
        }
    };

    const handleForceEnd = async (id: string) => {
        if (!confirm("Are you sure you want to force end this event? This cannot be undone.")) return;
        try {
            await api.post(`/events/${id}/end`);
            fetchEvents();
            alert("Event forced to end.");
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to end event");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthToken(null);
        router.push("/admin/login");
    };

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-muted/10">
            <header className="bg-background border-b p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span>{user?.name}</span>
                        <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-10 space-y-10">
                {/* Create Event Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Event</CardTitle>
                        <CardDescription>Set up a new CTF competition</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateEvent} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label>Event Name</label>
                                    <Input
                                        value={newEvent.name}
                                        onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label>Description</label>
                                    <Input
                                        value={newEvent.description}
                                        onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label>Registration Start *</label>
                                    <input
                                        type="datetime-local"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newEvent.registrationStartTime || ''}
                                        onChange={e => setNewEvent({ ...newEvent, registrationStartTime: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label>Registration End *</label>
                                    <input
                                        type="datetime-local"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newEvent.registrationEndTime || ''}
                                        onChange={e => setNewEvent({ ...newEvent, registrationEndTime: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label>Event Start *</label>
                                    <input
                                        type="datetime-local"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newEvent.eventStartTime || ''}
                                        onChange={e => setNewEvent({ ...newEvent, eventStartTime: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label>Event End *</label>
                                    <input
                                        type="datetime-local"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={newEvent.eventEndTime || ''}
                                        onChange={e => setNewEvent({ ...newEvent, eventEndTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Challenges Section */}
                            <div className="space-y-4 border p-4 rounded-md">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Challenges</h3>
                                    <Button type="button" variant="outline" onClick={addChallenge}>Add Challenge</Button>
                                </div>

                                {newEvent.challenges.map((challenge, index) => (
                                    <div key={index} className="grid gap-4 p-4 border rounded bg-muted/50 relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 text-destructive"
                                            onClick={() => removeChallenge(index)}
                                        >
                                            Remove
                                        </Button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Title</label>
                                                <Input
                                                    value={challenge.title}
                                                    onChange={e => updateChallenge(index, 'title', e.target.value)}
                                                    placeholder="e.g. Grumpy Guard"
                                                    required
                                                />
                                            </div>

                                            {/* Challenge Type Selector */}
                                            <div className="col-span-2 space-y-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
                                                <label className="text-sm font-medium">Challenge Type</label>
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                    value={challenge.type}
                                                    onChange={e => updateChallenge(index, 'type', e.target.value)}
                                                >
                                                    <option value="CHAT">Chat-Based Guard Challenge</option>
                                                    <option value="SIMULATION">Website Simulation Challenge</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Points</label>
                                                <Input
                                                    type="number"
                                                    value={challenge.points}
                                                    onChange={e => updateChallenge(index, 'points', parseInt(e.target.value))}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Difficulty</label>
                                                <Input
                                                    value={challenge.difficulty}
                                                    onChange={e => updateChallenge(index, 'difficulty', e.target.value)}
                                                    placeholder="Easy, Medium, Hard"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Flag</label>
                                                <Input
                                                    value={challenge.flag}
                                                    onChange={e => updateChallenge(index, 'flag', e.target.value)}
                                                    placeholder="FLAG-{...}"
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-sm font-medium">Description</label>
                                                <Input
                                                    value={challenge.description}
                                                    onChange={e => updateChallenge(index, 'description', e.target.value)}
                                                    placeholder="Brief description of the scenario"
                                                    required
                                                />
                                            </div>

                                            {/* CHAT Type - System Prompt */}
                                            {challenge.type === "CHAT" && (
                                                <div className="col-span-2 space-y-2">
                                                    <label className="text-sm font-medium">System Prompt (Chat Guard Personality)</label>
                                                    <textarea
                                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        value={challenge.systemPrompt}
                                                        onChange={e => updateChallenge(index, 'systemPrompt', e.target.value)}
                                                        placeholder="You are a guard..."
                                                    />
                                                </div>
                                            )}

                                            {/* Hints Section */}
                                            <div className="col-span-2 space-y-4 p-4 border rounded-md bg-muted/20">
                                                <h4 className="font-semibold text-sm">Hints (Optional)</h4>

                                                {/* Hint 1 */}
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Hint 1</label>
                                                        <Input
                                                            value={challenge.hint1 || ''}
                                                            onChange={e => updateChallenge(index, 'hint1', e.target.value)}
                                                            placeholder="First hint text..."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Penalty (points)</label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={challenge.hint1Penalty || ''}
                                                            onChange={e => updateChallenge(index, 'hint1Penalty', parseInt(e.target.value) || 0)}
                                                            placeholder="Points to deduct"
                                                            disabled={!challenge.hint1}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Hint 2 */}
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Hint 2</label>
                                                        <Input
                                                            value={challenge.hint2 || ''}
                                                            onChange={e => updateChallenge(index, 'hint2', e.target.value)}
                                                            placeholder="Second hint text..."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Penalty (points)</label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={challenge.hint2Penalty || ''}
                                                            onChange={e => updateChallenge(index, 'hint2Penalty', parseInt(e.target.value) || 0)}
                                                            placeholder="Points to deduct"
                                                            disabled={!challenge.hint2}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Hint 3 */}
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Hint 3</label>
                                                        <Input
                                                            value={challenge.hint3 || ''}
                                                            onChange={e => updateChallenge(index, 'hint3', e.target.value)}
                                                            placeholder="Third hint text..."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Penalty (points)</label>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={challenge.hint3Penalty || ''}
                                                            onChange={e => updateChallenge(index, 'hint3Penalty', parseInt(e.target.value) || 0)}
                                                            placeholder="Points to deduct"
                                                            disabled={!challenge.hint3}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SIMULATION Type - Website Configuration */}
                                            {challenge.type === "SIMULATION" && (
                                                <div className="col-span-2 space-y-4 p-4 border rounded-md bg-purple-50/50 dark:bg-purple-950/20">
                                                    <h4 className="font-medium text-purple-900 dark:text-purple-100">🌐 Website Simulation Configuration</h4>

                                                    {/* Theme Selector */}
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Website Theme</label>
                                                        <select
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={challenge.websiteTheme}
                                                            onChange={e => updateChallenge(index, 'websiteTheme', e.target.value)}
                                                        >
                                                            <option value="bank">Bank Dashboard</option>
                                                            <option value="ecommerce">E-Commerce Portal</option>
                                                            <option value="support">Support Center</option>
                                                        </select>
                                                    </div>

                                                    {/* Module 1 */}
                                                    <div className="grid gap-2">
                                                        <label className="text-sm font-medium">Module 1 Name</label>
                                                        <Input
                                                            value={challenge.module1Name}
                                                            onChange={e => updateChallenge(index, 'module1Name', e.target.value)}
                                                            placeholder="e.g., Summer Portfolio"
                                                        />
                                                        <label className="text-sm font-medium">Module 1 Content</label>
                                                        <textarea
                                                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={challenge.module1Content}
                                                            onChange={e => updateChallenge(index, 'module1Content', e.target.value)}
                                                            placeholder="Information shown in this module..."
                                                        />
                                                    </div>

                                                    {/* Module 2 */}
                                                    <div className="grid gap-2">
                                                        <label className="text-sm font-medium">Module 2 Name</label>
                                                        <Input
                                                            value={challenge.module2Name}
                                                            onChange={e => updateChallenge(index, 'module2Name', e.target.value)}
                                                            placeholder="e.g., Winter Portfolio"
                                                        />
                                                        <label className="text-sm font-medium">Module 2 Content</label>
                                                        <textarea
                                                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={challenge.module2Content}
                                                            onChange={e => updateChallenge(index, 'module2Content', e.target.value)}
                                                            placeholder="Information shown in this module..."
                                                        />
                                                    </div>

                                                    {/* Module 3 */}
                                                    <div className="grid gap-2">
                                                        <label className="text-sm font-medium">Module 3 Name</label>
                                                        <Input
                                                            value={challenge.module3Name}
                                                            onChange={e => updateChallenge(index, 'module3Name', e.target.value)}
                                                            placeholder="e.g., Spring Portfolio"
                                                        />
                                                        <label className="text-sm font-medium">Module 3 Content</label>
                                                        <textarea
                                                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={challenge.module3Content}
                                                            onChange={e => updateChallenge(index, 'module3Content', e.target.value)}
                                                            placeholder="Information shown in this module..."
                                                        />
                                                    </div>

                                                    {/* Locked Module */}
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Locked Module</label>
                                                        <select
                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={challenge.lockedModuleIndex}
                                                            onChange={e => updateChallenge(index, 'lockedModuleIndex', parseInt(e.target.value))}
                                                        >
                                                            <option value={0}>None (all unlocked)</option>
                                                            <option value={1}>Module 1</option>
                                                            <option value={2}>Module 2</option>
                                                            <option value={3}>Module 3</option>
                                                        </select>
                                                    </div>

                                                    {/* Locked Module Message */}
                                                    {challenge.lockedModuleIndex > 0 && (
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium">Lock Message</label>
                                                            <Input
                                                                value={challenge.lockedModuleMsg}
                                                                onChange={e => updateChallenge(index, 'lockedModuleMsg', e.target.value)}
                                                                placeholder="This module is restricted..."
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Chatbot Prompt */}
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Embedded Chatbot Personality</label>
                                                        <textarea
                                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            value={challenge.chatbotPrompt}
                                                            onChange={e => updateChallenge(index, 'chatbotPrompt', e.target.value)}
                                                            placeholder="You are a helpful assistant embedded in this website. Gradually reveal clues..."
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button type="submit" className="w-full">Create Event</Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Manage Events Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {events.map(event => (
                                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                                    <div>
                                        <h3 className="font-bold">{event.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Ends: {new Date(event.eventEndTime).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/events/${event.id}`}>
                                            <Button variant="outline" size="sm">View</Button>
                                        </Link>
                                        <Link href={`/events/${event.id}/leaderboard`}>
                                            <Button variant="secondary" size="sm">Leaderboard</Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleForceEnd(event.id)}
                                        >
                                            Force End
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && (
                                <p className="text-center text-muted-foreground">No events found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
