"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LeaderboardPage;
const react_1 = require("react");
const socket_io_client_1 = require("socket.io-client");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const api_1 = require("@/lib/api");
function LeaderboardPage() {
    const params = (0, navigation_1.useParams)();
    const eventId = params.id;
    const [scores, setScores] = (0, react_1.useState)([]);
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!eventId)
            return;
        // Initial fetch
        api_1.api.get(`/leaderboard/${eventId}`)
            .then(res => setScores(res.data))
            .catch(err => console.error("Failed to fetch leaderboard:", err));
        const socket = (0, socket_io_client_1.io)("http://localhost:3001/leaderboard");
        socket.on("connect", () => {
            setIsConnected(true);
        });
        socket.on(`leaderboard_update:${eventId}`, (data) => {
            setScores(data);
        });
        return () => {
            socket.disconnect();
        };
    }, [eventId]);
    return (<div className="container py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold">Live Leaderboard</h1>
                <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? "Live" : "Disconnected"}/>
            </div>

            <card_1.Card>
                <card_1.CardHeader>
                    <card_1.CardTitle>Top Teams</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
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
                                {scores.length === 0 ? (<tr>
                                        <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                            No teams yet. Be the first to join!
                                        </td>
                                    </tr>) : (scores.map((team) => (<tr key={team.teamId} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-bold">{team.rank}</td>
                                            <td className="p-4 align-middle">{team.name}</td>
                                            <td className="p-4 align-middle">{team.level}</td>
                                            <td className="p-4 align-middle text-right font-mono">{team.points}</td>
                                        </tr>)))}
                            </tbody>
                        </table>
                    </div>
                </card_1.CardContent>
            </card_1.Card>

            <div className="mt-8">
                <link_1.default href={`/events/${eventId}`}>
                    <button_1.Button variant="outline">← Back to Event</button_1.Button>
                </link_1.default>
            </div>
        </div>);
}
