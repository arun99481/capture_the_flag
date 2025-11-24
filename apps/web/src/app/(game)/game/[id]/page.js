"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GamePage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const card_1 = require("@/components/ui/card");
const api_1 = require("@/lib/api");
const SimulationChallenge_1 = __importDefault(require("@/components/SimulationChallenge"));
function GamePage() {
    const router = (0, navigation_1.useRouter)();
    const params = (0, navigation_1.useParams)();
    const id = params.id;
    const [challenges, setChallenges] = (0, react_1.useState)([]);
    const [selectedChallenge, setSelectedChallenge] = (0, react_1.useState)(null);
    const [team, setTeam] = (0, react_1.useState)(null);
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [input, setInput] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [timeLeft, setTimeLeft] = (0, react_1.useState)("00:00:00");
    const [eventEndTime, setEventEndTime] = (0, react_1.useState)(null);
    // Voice features
    const [voiceMode, setVoiceMode] = (0, react_1.useState)(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('voiceMode') === 'true';
        }
        return false;
    });
    const [isListening, setIsListening] = (0, react_1.useState)(false);
    const recognitionRef = (0, react_1.useRef)(null);
    const synthRef = (0, react_1.useRef)(null);
    const isSpeakingRef = (0, react_1.useRef)(false);
    // Hint tracking
    const [usedHints, setUsedHints] = (0, react_1.useState)({}); // challengeId => [hintNumbers]
    const [hintTexts, setHintTexts] = (0, react_1.useState)({}); // challengeId => {hintNum => text}
    const [loadingHint, setLoadingHint] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        (0, api_1.setAuthToken)(token);
        if (id) {
            fetchGameStatus();
        }
        // Initialize speech recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = 'en-US';
                recognitionRef.current.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setInput(transcript);
                    setIsListening(false);
                    // Auto-submit in voice mode
                    if (voiceMode && transcript.trim()) {
                        // Small delay to show the transcribed text
                        setTimeout(() => {
                            handleChatWithMessage(transcript);
                        }, 300);
                    }
                };
                recognitionRef.current.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                    // Restart listening in voice mode if there was an error
                    if (voiceMode && event.error !== 'aborted') {
                        setTimeout(() => startListening(), 1000);
                    }
                };
                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };
            }
        }
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthRef.current && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [id, voiceMode]);
    (0, react_1.useEffect)(() => {
        if (!eventEndTime)
            return;
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(eventEndTime).getTime();
            const distance = end - now;
            if (distance < 0) {
                setTimeLeft("00:00:00");
                clearInterval(interval);
                return;
            }
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(interval);
    }, [eventEndTime]);
    // Auto-start listening when voice mode is enabled
    (0, react_1.useEffect)(() => {
        if (voiceMode && selectedChallenge) {
            const timer = setTimeout(() => {
                if (!isSpeakingRef.current && !isListening) {
                    startListening();
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [voiceMode, selectedChallenge, isListening]);
    const fetchGameStatus = async () => {
        var _a, _b;
        try {
            const res = await api_1.api.get(`/game/${id}/status`);
            setChallenges(res.data.challenges);
            setTeam(res.data.team);
            setEventEndTime(res.data.eventEndTime);
            setLoading(false);
        }
        catch (error) {
            console.error("Failed to fetch game status:", error);
            setLoading(false);
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                alert("Session expired. Please login again.");
                router.push("/login");
            }
            else if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 404) {
                alert("You are not in a team for this event. Please join a team.");
                router.push(`/teams?eventId=${id}`);
            }
            else {
                alert("Failed to load game. Please try again.");
                router.push(`/teams?eventId=${id}`);
            }
        }
    };
    const handleSelectChallenge = (challenge) => {
        setSelectedChallenge(challenge);
        setMessages([
            { role: "system", content: challenge.description || "I am the Gatekeeper. What is the password?" }
        ]);
    };
    const startListening = () => {
        if (!recognitionRef.current || isSpeakingRef.current)
            return;
        try {
            recognitionRef.current.start();
            setIsListening(true);
        }
        catch (error) {
            // Ignore if already started
            if (error.message && !error.message.includes('already started')) {
                console.error('Error starting recognition:', error);
            }
        }
    };
    const handleChatWithMessage = async (message) => {
        if (!message.trim())
            return;
        if (!selectedChallenge)
            return;
        const newMessages = [...messages, { role: "user", content: message }];
        setMessages(newMessages);
        setInput("");
        try {
            const res = await api_1.api.post(`/ai/chat/${selectedChallenge.id}`, {
                messages: newMessages
            });
            const aiResponse = res.data.message;
            setMessages(prev => [...prev, {
                    role: "system",
                    content: aiResponse
                }]);
            // Auto-speak response in voice mode
            if (voiceMode && typeof window !== 'undefined' && window.speechSynthesis) {
                isSpeakingRef.current = true;
                const utterance = new SpeechSynthesisUtterance(aiResponse);
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.onend = () => {
                    isSpeakingRef.current = false;
                    // Restart listening after speaking
                    if (voiceMode) {
                        setTimeout(() => startListening(), 500);
                    }
                };
                synthRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            }
        }
        catch (error) {
            console.error('AI chat error:', error);
            const errorMsg = "Sorry, I encountered an error. Please try again.";
            setMessages(prev => [...prev, {
                    role: "system",
                    content: errorMsg
                }]);
            if (voiceMode && typeof window !== 'undefined' && window.speechSynthesis) {
                isSpeakingRef.current = true;
                const utterance = new SpeechSynthesisUtterance(errorMsg);
                utterance.onend = () => {
                    isSpeakingRef.current = false;
                    if (voiceMode) {
                        setTimeout(() => startListening(), 500);
                    }
                };
                synthRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            }
        }
    };
    const handleChat = async () => {
        await handleChatWithMessage(input);
    };
    const toggleVoiceMode = () => {
        const newValue = !voiceMode;
        setVoiceMode(newValue);
        localStorage.setItem('voiceMode', String(newValue));
        if (!newValue) {
            // Turning off voice mode
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            setIsListening(false);
            isSpeakingRef.current = false;
        }
        else {
            // Turning on voice mode - start listening
            if (selectedChallenge) {
                setTimeout(() => startListening(), 300);
            }
        }
    };
    const getHint = async (hintNumber) => {
        if (!selectedChallenge)
            return;
        setLoadingHint(hintNumber);
        try {
            const res = await api_1.api.get(`/game/${id}/challenge/${selectedChallenge.id}/hint/${hintNumber}`);
            // Update used hints
            setUsedHints(prev => (Object.assign(Object.assign({}, prev), { [selectedChallenge.id]: [...(prev[selectedChallenge.id] || []), hintNumber] })));
            // Store hint text
            setHintTexts(prev => (Object.assign(Object.assign({}, prev), { [selectedChallenge.id]: Object.assign(Object.assign({}, (prev[selectedChallenge.id] || {})), { [hintNumber]: res.data.hint }) })));
            // Show hint in alert with penalty info
            alert(`💡 Hint ${hintNumber}:\n\n${res.data.hint}\n\n⚠️ Penalty: -${res.data.penalty} points (deducted when you solve this challenge)`);
        }
        catch (error) {
            console.error('Failed to get hint:', error);
            alert('Failed to load hint. Please try again.');
        }
        finally {
            setLoadingHint(null);
        }
    };
    const handleSubmit = async () => {
        var _a, _b;
        if (!selectedChallenge)
            return;
        try {
            const res = await api_1.api.post(`/game/${id}/challenge/${selectedChallenge.id}/solve`, { password });
            if (res.data.success) {
                alert(`Correct! You earned ${res.data.points} points.`);
                setPassword("");
                fetchGameStatus(); // Refresh status to update points and solved status
                setSelectedChallenge(null); // Go back to board
            }
            else {
                alert(res.data.message || "Incorrect password.");
            }
        }
        catch (e) {
            console.error(e);
            const errorMessage = ((_b = (_a = e.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || "Error submitting.";
            alert(errorMessage);
        }
    };
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }
    return (<div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button_1.Button variant="ghost" size="sm" onClick={() => router.push("/events")}>
                            ← Back to Events
                        </button_1.Button>
                        <span className="font-bold">{team === null || team === void 0 ? void 0 : team.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-bold">Points: {team === null || team === void 0 ? void 0 : team.points}</span>
                        <div className="font-mono text-xl font-bold text-cmu-red">
                            {timeLeft}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {selectedChallenge ? (selectedChallenge.type === "SIMULATION" ? (
        // SIMULATION Challenge View
        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="mb-4 flex justify-between items-center">
                                <button_1.Button variant="ghost" size="sm" onClick={() => setSelectedChallenge(null)}>
                                    ← Back to Board
                                </button_1.Button>
                            </div>
                            <SimulationChallenge_1.default challenge={selectedChallenge} eventId={id} onFlagSubmit={handleSubmit} usedHints={usedHints[selectedChallenge.id] || []} onGetHint={getHint} hintTexts={hintTexts[selectedChallenge.id] || {}}/>
                        </div>) : (
        // CHAT Challenge View (Original)
        <div className="flex flex-1">
                            {/* Chat Area */}
                            <div className="flex-1 flex flex-col p-4 border-r">
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="text-xl font-bold">{selectedChallenge.title}</h2>
                                    <button_1.Button variant="ghost" size="sm" onClick={() => setSelectedChallenge(null)}>
                                        Back to Board
                                    </button_1.Button>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                                    {messages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`rounded-lg p-3 max-w-[80%] ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                {m.content}
                                            </div>
                                        </div>))}
                                </div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex gap-2">
                                        {typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition) && window.speechSynthesis && (<button_1.Button variant={voiceMode ? "default" : "outline"} size="sm" onClick={toggleVoiceMode} className={voiceMode ? 'bg-gradient-to-r from-blue-500 to-purple-500' : ''}>
                                                {voiceMode ? (<>
                                                        {isListening ? '🎤 Listening...' : isSpeakingRef.current ? '🔊 Speaking...' : '🎤 Voice Mode ON'}
                                                    </>) : ('🎤 Voice Mode')}
                                            </button_1.Button>)}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <input_1.Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={voiceMode ? "Listening for voice input..." : "Type a message to the AI..."} onKeyDown={(e) => e.key === 'Enter' && !voiceMode && handleChat()} disabled={voiceMode}/>
                                    <button_1.Button onClick={handleChat} disabled={voiceMode}>Send</button_1.Button>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="w-80 p-4 bg-muted/10 flex flex-col gap-6 overflow-y-auto">
                                <card_1.Card>
                                    <card_1.CardHeader>
                                        <card_1.CardTitle>Mission</card_1.CardTitle>
                                    </card_1.CardHeader>
                                    <card_1.CardContent>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedChallenge.description}
                                        </p>
                                        <div className="mt-4 text-sm">
                                            <p><strong>Difficulty:</strong> {selectedChallenge.difficulty}</p>
                                            <p><strong>Points:</strong> {selectedChallenge.points}</p>
                                        </div>
                                    </card_1.CardContent>
                                </card_1.Card>

                                {/* Hints Section */}
                                <card_1.Card>
                                    <card_1.CardHeader>
                                        <card_1.CardTitle>💡 Hints Available</card_1.CardTitle>
                                    </card_1.CardHeader>
                                    <card_1.CardContent className="space-y-3">
                                        {[1, 2, 3].map(hintNum => {
                var _a;
                const isUsed = (usedHints[selectedChallenge.id] || []).includes(hintNum);
                const hintText = (_a = hintTexts[selectedChallenge.id]) === null || _a === void 0 ? void 0 : _a[hintNum];
                const penalty = selectedChallenge[`hint${hintNum}Penalty`] || 0;
                const hasHint = selectedChallenge[`hint${hintNum}`];
                if (!hasHint)
                    return null;
                return (<div key={hintNum} className="space-y-2">
                                                    <button_1.Button variant={isUsed ? "secondary" : "outline"} size="sm" onClick={() => getHint(hintNum)} disabled={isUsed || loadingHint !== null} className="w-full justify-between">
                                                        <span>Hint {hintNum}</span>
                                                        <span className="text-xs">
                                                            {isUsed ? '✓ Used' : `-${penalty} pts`}
                                                        </span>
                                                    </button_1.Button>
                                                    {hintText && (<div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md text-sm border border-yellow-200 dark:border-yellow-800">
                                                            <p className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">💡 Hint {hintNum}:</p>
                                                            <p className="text-yellow-800 dark:text-yellow-200">{hintText}</p>
                                                        </div>)}
                                                </div>);
            })}
                                        {![1, 2, 3].some(n => selectedChallenge[`hint${n}`]) && (<p className="text-sm text-muted-foreground text-center py-2">
                                                No hints available for this challenge
                                            </p>)}
                                    </card_1.CardContent>
                                </card_1.Card>

                                <card_1.Card>
                                    <card_1.CardHeader>
                                        <card_1.CardTitle>Submit Flag</card_1.CardTitle>
                                    </card_1.CardHeader>
                                    <card_1.CardContent className="space-y-4">
                                        <input_1.Input placeholder="FLAG-{...}" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                        <button_1.Button className="w-full" onClick={handleSubmit}>Submit</button_1.Button>
                                    </card_1.CardContent>
                                </card_1.Card>
                            </div>
                        </div>)) : (
        // Challenge Board View
        <div className="container py-8 overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Challenge Board</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {challenges.map((challenge) => (<card_1.Card key={challenge.id} className={`cursor-pointer hover:shadow-lg transition-shadow ${challenge.status === 'SOLVED' ? 'border-green-500 bg-green-50/50' : ''}`} onClick={() => handleSelectChallenge(challenge)}>
                                    <card_1.CardHeader>
                                        <div className="flex justify-between items-start">
                                            <card_1.CardTitle>{challenge.title}</card_1.CardTitle>
                                            {challenge.status === 'SOLVED' && (<span className="bg-green-500 text-white text-xs px-2 py-1 rounded">SOLVED</span>)}
                                        </div>
                                    </card_1.CardHeader>
                                    <card_1.CardContent>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {challenge.description}
                                        </p>
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>{challenge.difficulty}</span>
                                            <span>{challenge.points} pts</span>
                                        </div>
                                    </card_1.CardContent>
                                </card_1.Card>))}
                        </div>
                    </div>)}
            </div>
        </div>);
}
