import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Welcome, Student</span>
                        <Button variant="outline" size="sm">Logout</Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">My Teams</h2>
                    <div className="flex items-center space-x-2">
                        <Link href="/events">
                            <Button>Join New Event</Button>
                        </Link>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                TartanHacks CTF
                            </CardTitle>
                            <span className="text-xs text-muted-foreground">Active</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Team: Hackers</div>
                            <p className="text-xs text-muted-foreground">
                                Level 3 • 4500 Points
                            </p>
                            <div className="mt-4">
                                <Link href="/game/1">
                                    <Button className="w-full">Enter Game</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
