"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminPage;
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
function AdminPage() {
    return (<div className="flex min-h-screen flex-col">
            <header className="border-b bg-background p-4">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </header>
            <main className="flex-1 p-8 space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <card_1.Card>
                        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <card_1.CardTitle className="text-sm font-medium">Total Users</card_1.CardTitle>
                        </card_1.CardHeader>
                        <card_1.CardContent>
                            <div className="text-2xl font-bold">1,234</div>
                        </card_1.CardContent>
                    </card_1.Card>
                    <card_1.Card>
                        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <card_1.CardTitle className="text-sm font-medium">Active Events</card_1.CardTitle>
                        </card_1.CardHeader>
                        <card_1.CardContent>
                            <div className="text-2xl font-bold">2</div>
                        </card_1.CardContent>
                    </card_1.Card>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Events Management</h2>
                        <button_1.Button>Create New Event</button_1.Button>
                    </div>
                    <card_1.Card>
                        <card_1.CardContent className="p-0">
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
                                            <button_1.Button variant="outline" size="sm" className="mr-2">Edit</button_1.Button>
                                            <button_1.Button variant="destructive" size="sm">Stop</button_1.Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </card_1.CardContent>
                    </card_1.Card>
                </div>
            </main>
        </div>);
}
