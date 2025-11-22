"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { setAuthToken } from "@/lib/api";

export default function EventDetailsPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthToken(null);
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

                        </nav>
                        <div className="flex items-center gap-2 ml-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        {user.username || user.email}
                                    </span>
                                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <Link href="/login">
                                    <Button size="sm">Login</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto py-10">
                <div className="max-w-3xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl">{event.title}</CardTitle>
                            <CardDescription className="text-lg">{event.date}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                                <Button size="lg" className="w-full" onClick={handleRegister}>
                                    Join / Create Team
                                </Button>
                                <Link href={`/events/${id}/leaderboard`}>
                                    <Button size="lg" variant="secondary" className="w-full">View Leaderboard</Button>
                                </Link>
                                <Link href="/events">
                                    <Button size="lg" variant="outline" className="w-full">Back to Events</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
