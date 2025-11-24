'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

interface SimulationChallengeProps {
    challenge: any;
    eventId: string;
    onFlagSubmit: (flag: string) => void;
    usedHints: number[];
    onGetHint: (hintNumber: number) => void;
    hintTexts: { [key: number]: string };
}

export default function SimulationChallenge({
    challenge,
    eventId,
    onFlagSubmit,
    usedHints,
    onGetHint,
    hintTexts,
}: SimulationChallengeProps) {
    const [selectedModule, setSelectedModule] = useState<number | null>(null);
    const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [flagInput, setFlagInput] = useState('');

    const modules = [
        { index: 1, name: challenge.module1Name, content: challenge.module1Content },
        { index: 2, name: challenge.module2Name, content: challenge.module2Content },
        { index: 3, name: challenge.module3Name, content: challenge.module3Content },
    ];

    const isModuleLocked = (index: number) => challenge.lockedModuleIndex === index;

    const handleModuleClick = (index: number) => {
        if (isModuleLocked(index)) {
            alert(challenge.lockedModuleMsg || 'This module is locked.');
        } else {
            setSelectedModule(index);
        }
    };

    const handleChatSend = async () => {
        if (!chatInput.trim() || chatLoading) return;

        const userMessage = chatInput.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setChatLoading(true);

        try {
            // TODO: Create simulation chatbot endpoint
            const res = await api.post(`/ai/simulation/${challenge.id}`, {
                message: userMessage,
                history: chatMessages,
            });

            setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not process your message.' }]);
        } finally {
            setChatLoading(false);
        }
    };

    const handleFlagSubmit = () => {
        if (flagInput.trim()) {
            onFlagSubmit(flagInput.trim());
            setFlagInput('');
        }
    };

    // Theme-based styling
    const getThemeStyles = () => {
        switch (challenge.websiteTheme) {
            case 'bank':
                return {
                    bg: 'bg-blue-900',
                    accent: 'bg-blue-700',
                    text: 'text-blue-100',
                    header: 'bg-gradient-to-r from-blue-800 to-blue-900',
                };
            case 'ecommerce':
                return {
                    bg: 'bg-purple-900',
                    accent: 'bg-purple-700',
                    text: 'text-purple-100',
                    header: 'bg-gradient-to-r from-purple-800 to-purple-900',
                };
            case 'support':
                return {
                    bg: 'bg-green-900',
                    accent: 'bg-green-700',
                    text: 'text-green-100',
                    header: 'bg-gradient-to-r from-green-800 to-green-900',
                };
            default:
                return {
                    bg: 'bg-gray-900',
                    accent: 'bg-gray-700',
                    text: 'text-gray-100',
                    header: 'bg-gradient-to-r from-gray-800 to-gray-900',
                };
        }
    };

    const theme = getThemeStyles();

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Simulated Website Header */}
            <div className={`${theme.header} p-4 rounded-lg shadow-lg`}>
                <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
                <p className="text-sm text-gray-200">{challenge.websiteTheme?.toUpperCase()} Portal</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
                {/* Left: Modules Panel */}
                <div className="lg:col-span-1 space-y-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">📁 Modules</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {modules.map((module) => (
                                <Button
                                    key={module.index}
                                    onClick={() => handleModuleClick(module.index)}
                                    variant={selectedModule === module.index ? 'default' : 'outline'}
                                    className="w-full justify-start"
                                    disabled={isModuleLocked(module.index)}
                                >
                                    {isModuleLocked(module.index) && '🔒 '}
                                    {module.name}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Hints Section */}
                    <Card className="bg-yellow-50 dark:bg-yellow-950">
                        <CardHeader>
                            <CardTitle className="text-lg">💡 Hints Available</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {[1, 2, 3].map((hintNum) => {
                                const hintText = challenge[`hint${hintNum}`];
                                const penalty = challenge[`hint${hintNum}Penalty`];
                                const isUsed = usedHints?.includes(hintNum);

                                if (!hintText) return null;

                                return (
                                    <div key={hintNum}>
                                        <Button
                                            onClick={() => onGetHint(hintNum)}
                                            disabled={isUsed}
                                            variant={isUsed ? 'secondary' : 'default'}
                                            size="sm"
                                            className="w-full"
                                        >
                                            {isUsed ? `✓ Hint ${hintNum} Used` : `Hint ${hintNum}: -${penalty} pts`}
                                        </Button>
                                        {isUsed && hintTexts[hintNum] && (
                                            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900 rounded text-sm">
                                                {hintTexts[hintNum]}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Content Area */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Module Content Display */}
                    {selectedModule && (
                        <Card>
                            <CardHeader>
                                <CardTitle>{modules.find(m => m.index === selectedModule)?.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">
                                    {modules.find(m => m.index === selectedModule)?.content}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Embedded Chatbot */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle className="text-lg">💬 Assistance Chat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Chat Messages */}
                            <div className="h-48 overflow-y-auto space-y-2 p-2 border rounded-md bg-muted/20">
                                {chatMessages.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        Start a conversation...
                                    </p>
                                )}
                                {chatMessages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`p-2 rounded-md ${msg.role === 'user'
                                            ? 'bg-blue-100 dark:bg-blue-900 ml-8'
                                            : 'bg-gray-100 dark:bg-gray-800 mr-8'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <div className="flex gap-2">
                                <Input
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                                    placeholder="Type your message..."
                                    disabled={chatLoading}
                                />
                                <Button onClick={handleChatSend} disabled={chatLoading}>
                                    {chatLoading ? 'Sending...' : 'Send'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* FLAG Submission */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">🚩 Submit FLAG</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Input
                                value={flagInput}
                                onChange={(e) => setFlagInput(e.target.value)}
                                placeholder="FLAG-{...}"
                                onKeyPress={(e) => e.key === 'Enter' && handleFlagSubmit()}
                            />
                            <Button onClick={handleFlagSubmit} className="w-full">
                                Submit FLAG
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
