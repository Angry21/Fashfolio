"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { X, Send, Sparkles, Briefcase } from "lucide-react";

const API_URL = "http://localhost:5000";

export default function PixieChat() {
    const pathname = usePathname();
    const isHQ = pathname === "/hq"; // Detects if we are in Strategic Mode

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // 1. DYNAMIC GREETING: Reset chat when moving between Studio and HQ
    useEffect(() => {
        if (isHQ) {
            setMessages([{ role: "agent", text: "Commander. I am online. Ready for strategic analysis." }]);
        } else {
            setMessages([{ role: "agent", text: "Hi! ✨ I love what you're working on. Need a second opinion?" }]);
        }
    }, [isHQ]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            // 2. CONTEXT INJECTION: Send the current 'Mode' to the backend
            const res = await axios.post(`${API_URL}/api/agent/chat`, {
                message: userMsg,
                context: isHQ ? "STRATEGIC_MODE" : "CREATIVE_MODE"
            });
            setMessages((prev) => [...prev, { role: "agent", text: res.data.response }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "agent", text: "I'm having trouble reaching the mainframe. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    // 3. VISUAL CLUES: Green for Strategy (HQ), Black for Style (Studio)
                    className={`${isHQ ? 'bg-green-700 hover:bg-green-600' : 'bg-black hover:bg-gray-800'
                        } text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2`}
                >
                    {isHQ ? <Briefcase size={20} /> : <Sparkles size={20} className="text-pink-400" />}
                    <span className="font-bold pr-2">{isHQ ? "Strategize" : "Ask Pixie"}</span>
                </button>
            )}

            {isOpen && (
                <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* Header Changes Color based on Mode */}
                    <div className={`${isHQ ? 'bg-gray-900 text-green-400 border-b border-green-900' : 'bg-gradient-to-r from-gray-900 to-black text-white'
                        } p-4 flex justify-between items-center transition-colors duration-300`}>
                        <div className="flex items-center gap-2">
                            {isHQ ? <Briefcase size={16} /> : <Sparkles size={16} className="text-pink-400" />}
                            <span className="font-bold">{isHQ ? "Pixie (Strategic)" : "Pixie (Creative)"}</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:opacity-70 text-white/80">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isHQ ? 'bg-gray-950' : 'bg-gray-50'}`}>
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${m.role === "user"
                                            ? `${isHQ ? 'bg-green-700 text-white' : 'bg-black text-white'} rounded-br-none`
                                            : `${isHQ ? 'bg-gray-800 text-green-100 border-gray-700' : 'bg-white text-gray-800 border-gray-100'} border rounded-bl-none`
                                        }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className={`text-xs p-2 animate-pulse ${isHQ ? 'text-green-500' : 'text-gray-400'}`}>
                                {isHQ ? "Running tactical simulations..." : "Pixie is thinking..."}
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className={`p-3 border-t flex gap-2 ${isHQ ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
                        <input
                            className={`flex-1 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 ${isHQ ? 'bg-gray-800 text-white focus:ring-green-500 placeholder-gray-500' : 'bg-gray-100 text-black focus:ring-black/5'
                                }`}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isHQ ? "Enter command..." : "Ask about style..."}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className={`${isHQ ? 'bg-green-700 hover:bg-green-600' : 'bg-black hover:opacity-80'} text-white p-2 rounded-full disabled:opacity-50 transition-colors`}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
