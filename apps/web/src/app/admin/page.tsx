import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b bg-background p-4">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </header>
            <main className="flex-1 p-8 space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2</div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Events Management</h2>
                        <Button>Create New Event</Button>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted">
                                    <tr>
                                        <th className="px-6 py-3">Event Name</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Teams</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-background border-b">
                                        <td className="px-6 py-4 font-medium">TartanHacks CTF</td>
                                        <td className="px-6 py-4 text-green-600">Active</td>
                                        <td className="px-6 py-4">45</td>
                                        <td className="px-6 py-4">
                                            <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                                            <Button variant="destructive" size="sm">Stop</Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
