"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AboutPage;
const link_1 = __importDefault(require("next/link"));
const button_1 = require("@/components/ui/button");
function AboutPage() {
    return (<div className="container mx-auto py-10">
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-4">About TartanCTF</h1>
                    <p className="text-lg text-muted-foreground">
                        A next-generation Capture the Flag platform built for Carnegie Mellon University students.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">What is TartanCTF?</h2>
                    <p className="text-muted-foreground">
                        TartanCTF is an innovative cybersecurity challenge platform that combines traditional
                        CTF gameplay with AI-powered challenges. Players work in teams to solve progressively
                        difficult puzzles, earning points and climbing the real-time leaderboard.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">How It Works</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Form a team of up to 4 members</li>
                        <li>Register for an active CTF event</li>
                        <li>Solve AI-generated challenges to progress through levels</li>
                        <li>Extract passwords from AI conversations</li>
                        <li>Earn points based on speed and difficulty</li>
                        <li>Compete on the live leaderboard</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Features</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Real-time WebSocket-based leaderboard</li>
                        <li>AI-powered challenge generation</li>
                        <li>Team-based gameplay</li>
                        <li>Progressive difficulty system</li>
                        <li>Admin dashboard for event management</li>
                    </ul>
                </div>

                <div className="pt-6">
                    <link_1.default href="/">
                        <button_1.Button size="lg">Get Started →</button_1.Button>
                    </link_1.default>
                </div>
            </div>
        </div>);
}
