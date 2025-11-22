"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api, setAuthToken } from "@/lib/api";

function TeamsContent() {
    const [user, setUser] = useState<any>(null);
    const [teamName, setTeamName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [eventId, setEventId] = useState("");
    const [myTeam, setMyTeam] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
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

    const fetchMyTeam = async (eventId: string) => {
        try {
            const response = await api.get(`/teams/my-team?eventId=${eventId}`);
            setMyTeam(response.data);
        } catch (err: any) {
            // No team found is okay
            console.log("No team found for this event");
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);


        try {
            const response = await api.post("/teams", {
                name: teamName,
                eventId: eventId,
            });

            setMyTeam(response.data);
            setSuccess(`Team "${teamName}" created! Invite code: ${response.data.joinCode}`);
            setTeamName("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create team");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post("/teams/join", {
                joinCode: joinCode,
            });

            setMyTeam(response.data);
            setSuccess(`Successfully joined team "${response.data.name}"!`);
            setJoinCode("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to join team");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthToken(null);
        router.push("/login");
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex">
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <span className="hidden font-bold sm:inline-block text-cmu-red text-xl">
                                TartanCTF
                            </span>
                        </Link>
                    </div>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <nav className="flex items-center space-x-6">
                            <Link href="/events" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60">
                                Events
                            </Link>

                            <span className="text-sm text-muted-foreground">
                                Welcome, {user.name}
                            </span>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto py-10 flex-1">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Team Management</h1>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded text-red-500">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded text-green-500">
                            {success}
                        </div>
                    )}

                    {/* Current Team */}
                    {myTeam && (
                        <Card className="mb-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl">Your Current Team</CardTitle>
                                    <CardDescription>You're all set!</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => fetchMyTeam(eventId)}>
                                    Refresh Status
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                        {myTeam.members?.map((member: any) => (
                                            <div key={member.id} className="flex items-center gap-2 text-sm">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                {member.user.name} ({member.user.email})
                                            </div>
                                        )) || <p className="text-sm text-muted-foreground">No members yet</p>}
                                    </div>
                                </div>
                                {eventId && (
                                    <Link href={`/game/${eventId}`}>
                                        <Button className="w-full" size="lg">
                                            Start Playing →
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Create or Join Team */}
                    {!myTeam && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Create Team */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Create a Team</CardTitle>
                                    <CardDescription>Start a new team for this event</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleCreateTeam} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="teamName" className="text-sm font-medium">
                                                Team Name
                                            </label>
                                            <Input
                                                id="teamName"
                                                placeholder="Awesome Team"
                                                value={teamName}
                                                onChange={(e) => setTeamName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={loading || !eventId}>
                                            {loading ? "Creating..." : "Create Team"}
                                        </Button>
                                        {!eventId && (
                                            <p className="text-sm text-yellow-500">
                                                ⚠️ Please select an event first
                                            </p>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Join Team */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Join a Team</CardTitle>
                                    <CardDescription>Enter an invite code to join</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleJoinTeam} className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="joinCode" className="text-sm font-medium">
                                                Invite Code
                                            </label>
                                            <Input
                                                id="joinCode"
                                                placeholder="ABC123"
                                                value={joinCode}
                                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={loading} variant="secondary">
                                            {loading ? "Joining..." : "Join Team"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="mt-8">
                        <Link href="/events">
                            <Button variant="outline">← Back to Events</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TeamsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TeamsContent />
        </Suspense>
    );
}
