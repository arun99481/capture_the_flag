"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface TeamScore {
    rank: number;
    teamId: string;
    name: string;
    level: number;
    points: number;
}

export default function LeaderboardPage() {
    const params = useParams();
    const eventId = params.id as string;
    const [scores, setScores] = useState<TeamScore[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!eventId) return;

        // Initial fetch
        api.get(`/leaderboard/${eventId}`)
            .then(res => setScores(res.data))
            .catch(err => console.error("Failed to fetch leaderboard:", err));

        const socket = io("http://localhost:3001/leaderboard");

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on(`leaderboard_update:${eventId}`, (data: TeamScore[]) => {
            setScores(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [eventId]);

    return (
        <div className="container py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold">Live Leaderboard</h1>
                <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? "Live" : "Disconnected"} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top Teams</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rank</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Team</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Level</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Points</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {scores.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                            No teams yet. Be the first to join!
                                        </td>
                                    </tr>
                                ) : (
                                    scores.map((team) => (
                                        <tr key={team.teamId} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-bold">{team.rank}</td>
                                            <td className="p-4 align-middle">{team.name}</td>
                                            <td className="p-4 align-middle">{team.level}</td>
                                            <td className="p-4 align-middle text-right font-mono">{team.points}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8">
                <Link href={`/events/${eventId}`}>
                    <Button variant="outline">← Back to Event</Button>
                </Link>
            </div>
        </div>
    );
}
