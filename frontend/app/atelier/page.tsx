"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot, Shirt, ArrowRight } from "lucide-react";
import Link from "next/link"; // For navigation back to Studio if needed

export default function AtelierPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            content: "Welcome to the Atelier. I'm Pixel, your AI fashion architect. How can I help you curate or design today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulate AI Response (Mock for UI)
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                role: "assistant",
                content: "That's a fascinating concept. Based on current micro-trends in New York, combining that texture with a Cyber-Noir aesthetic would score highly on the trend matrix.",
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Header */}
            <header className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl">
                        <Sparkles className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">AI Atelier</h1>
                        <p className="text-xs text-gray-400 font-medium">Powered by Gemini Vision</p>
                    </div>
                </div>
                <Link href="/" className="text-sm font-bold text-gray-400 hover:text-black transition">
                    Exit to Studio
                </Link>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex gap-4 max-w-3xl mx-auto ${m.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.role === "assistant" ? "bg-black text-white" : "bg-gray-200 text-gray-500"}`}>
                            {m.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
                        </div>

                        {/* Bubble */}
                        <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${m.role === "assistant"
                                ? "bg-white border border-gray-100 rounded-tl-none"
                                : "bg-black text-white rounded-tr-none"
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-4 max-w-3xl mx-auto">
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                            <Bot size={18} />
                        </div>
                        <div className="bg-white border border-gray-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="max-w-3xl mx-auto">
                    {/* Quick Prompts */}
                    {messages.length === 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            {["Generate a summer collection", "Analyze this texture", "What's trending in Tokyo?"].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setInput(tag)}
                                    className="whitespace-nowrap px-4 py-2 bg-gray-50 hover:bg-gray-100 text-xs font-bold rounded-full border border-gray-200 transition"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex items-center">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask Pixel to design something..."
                            className="w-full bg-gray-100 p-4 pl-5 rounded-full outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="absolute right-2 p-2 bg-black text-white rounded-full hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-3 font-medium">Pixel AI v2.0 • FashFolio Studio</p>
                </div>
            </div>
        </div>
    );
}
