"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PracticePage;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const api_1 = require("@/lib/api");
const link_1 = __importDefault(require("next/link"));
function PracticePage() {
    const [messages, setMessages] = (0, react_1.useState)([
        { role: 'assistant', content: "Hello! I am the Practice Gatekeeper. I'm guarding a secret password, but I'm very friendly. Try asking me for it!" }
    ]);
    const [input, setInput] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const scrollRef = (0, react_1.useRef)(null);
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
    (0, react_1.useEffect)(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    (0, react_1.useEffect)(() => {
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
                        setTimeout(() => {
                            handleSendWithMessage(transcript);
                        }, 300);
                    }
                };
                recognitionRef.current.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
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
    }, [voiceMode]);
    // Auto-start listening when voice mode is enabled
    (0, react_1.useEffect)(() => {
        if (voiceMode) {
            const timer = setTimeout(() => {
                if (!isSpeakingRef.current && !isListening) {
                    startListening();
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [voiceMode, isSpeakingRef.current, isListening]);
    const startListening = () => {
        if (!recognitionRef.current || isSpeakingRef.current)
            return;
        try {
            recognitionRef.current.start();
            setIsListening(true);
        }
        catch (error) {
            if (error.message && !error.message.includes('already started')) {
                console.error('Error starting recognition:', error);
            }
        }
    };
    const handleSendWithMessage = async (message) => {
        if (!message.trim() || loading)
            return;
        const userMessage = { role: 'user', content: message };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);
        try {
            const response = await api_1.api.post("/ai/practice", {
                messages: updatedMessages.filter(m => m.role !== 'system')
            });
            const aiMessage = { role: 'assistant', content: response.data.message };
            setMessages(prev => [...prev, aiMessage]);
            // Auto-speak response in voice mode
            if (voiceMode && typeof window !== 'undefined' && window.speechSynthesis) {
                isSpeakingRef.current = true;
                const utterance = new SpeechSynthesisUtterance(response.data.message);
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
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
        catch (error) {
            console.error("Failed to send message", error);
            const errorMsg = "Error: Could not connect to AI.";
            setMessages(prev => [...prev, { role: 'system', content: errorMsg }]);
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
        finally {
            setLoading(false);
        }
    };
    const handleSend = async (e) => {
        e.preventDefault();
        await handleSendWithMessage(input);
    };
    const toggleVoiceMode = () => {
        const newValue = !voiceMode;
        setVoiceMode(newValue);
        localStorage.setItem('voiceMode', String(newValue));
        if (!newValue) {
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
            setTimeout(() => startListening(), 300);
        }
    };
    return (<div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <card_1.Card className="w-full max-w-2xl h-[80vh] flex flex-col">
                <card_1.CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <card_1.CardTitle>Practice Arena</card_1.CardTitle>
                            <card_1.CardDescription>Try to trick the AI into revealing the password: PRACTICE-FLAG-123</card_1.CardDescription>
                        </div>
                        <link_1.default href="/">
                            <button_1.Button variant="outline" size="sm">Exit Practice</button_1.Button>
                        </link_1.default>
                    </div>
                </card_1.CardHeader>
                <card_1.CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                    <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
                        <div className="space-y-4">
                            {messages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${m.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : m.role === 'system'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-muted'}`}>
                                        {m.content}
                                    </div>
                                </div>))}
                            {loading && (<div className="flex justify-start">
                                    <div className="bg-muted p-3 rounded-lg animate-pulse">
                                        Thinking...
                                    </div>
                                </div>)}
                        </div>
                    </div>
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-2 mb-2">
                            {typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition) && window.speechSynthesis && (<button_1.Button type="button" variant={voiceMode ? "default" : "outline"} size="sm" onClick={toggleVoiceMode} className={voiceMode ? 'bg-gradient-to-r from-blue-500 to-purple-500' : ''}>
                                    {voiceMode ? (<>
                                            {isListening ? '🎤 Listening...' : isSpeakingRef.current ? '🔊 Speaking...' : '🎤 Voice Mode ON'}
                                        </>) : ('🎤 Voice Mode')}
                                </button_1.Button>)}
                        </div>
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input_1.Input value={input} onChange={e => setInput(e.target.value)} placeholder={voiceMode ? "Listening for voice input..." : "Type your message..."} disabled={loading || voiceMode}/>
                            <button_1.Button type="submit" disabled={loading || voiceMode}>Send</button_1.Button>
                        </form>
                    </div>
                </card_1.CardContent>
            </card_1.Card>
        </div>);
}
