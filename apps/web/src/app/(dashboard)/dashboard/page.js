"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const link_1 = __importDefault(require("next/link"));
function DashboardPage() {
    return (<div className="flex min-h-screen flex-col">
            <header className="border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Welcome, Student</span>
                        <button_1.Button variant="outline" size="sm">Logout</button_1.Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">My Teams</h2>
                    <div className="flex items-center space-x-2">
                        <link_1.default href="/events">
                            <button_1.Button>Join New Event</button_1.Button>
                        </link_1.default>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <card_1.Card>
                        <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <card_1.CardTitle className="text-sm font-medium">
                                TartanHacks CTF
                            </card_1.CardTitle>
                            <span className="text-xs text-muted-foreground">Active</span>
                        </card_1.CardHeader>
                        <card_1.CardContent>
                            <div className="text-2xl font-bold">Team: Hackers</div>
                            <p className="text-xs text-muted-foreground">
                                Level 3 • 4500 Points
                            </p>
                            <div className="mt-4">
                                <link_1.default href="/game/1">
                                    <button_1.Button className="w-full">Enter Game</button_1.Button>
                                </link_1.default>
                            </div>
                        </card_1.CardContent>
                    </card_1.Card>
                </div>
            </main>
        </div>);
}
