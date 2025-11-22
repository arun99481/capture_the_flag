"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api, setAuthToken } from "@/lib/api";

interface Event {
    id: string;
    name: string;
    description?: string;
    eventStartTime: string;
    eventEndTime: string;
    registrationStartTime: string;
    registrationEndTime: string;
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
        }
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get("/events");
            setEvents(response.data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const isEventActive = (event: Event) => {
        const now = new Date();
        const start = new Date(event.eventStartTime);
        const end = new Date(event.eventEndTime);
        return now >= start && now <= end;
    };

    const isRegistrationOpen = (event: Event) => {
        const now = new Date();
        const start = new Date(event.registrationStartTime);
        const end = new Date(event.registrationEndTime);
        return now >= start && now <= end;
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center">Loading events...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">CTF Events</h1>
                <p className="text-muted-foreground">
                    Browse and register for upcoming Capture the Flag competitions
                </p>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No events available at the moment.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <Card key={event.id}>
                            <CardHeader>
                                <CardTitle>{event.name}</CardTitle>
                                <CardDescription>
                                    {formatDate(event.eventStartTime)}
                                    {isEventActive(event) && (
                                        <span className="ml-2 text-green-600 font-semibold">● LIVE</span>
                                    )}
                                    {!isEventActive(event) && isRegistrationOpen(event) && (
                                        <span className="ml-2 text-blue-600 font-semibold">Registration Open</span>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {event.description || "Join this exciting CTF competition!"}
                                </p>
                                <div className="flex gap-2">
                                    <Link href={`/events/${event.id}`} className="flex-1">
                                        <Button className="w-full">View Details</Button>
                                    </Link>
                                    <Link href={`/teams?eventId=${event.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">Join Team</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="mt-8">
                <Link href="/">
                    <Button variant="outline">← Back to Home</Button>
                </Link>
            </div>
        </div>
    );
}
