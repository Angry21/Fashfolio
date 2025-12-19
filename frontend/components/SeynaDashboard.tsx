'use client';

import { useState } from 'react';
import axios from 'axios';
import { Cpu, Palette, CircleDollarSign, Megaphone, Loader2, Send, Terminal } from 'lucide-react';

// Set API URL (change if deployed)
const API_URL = 'http://localhost:5000';

const SeynaDashboard = () => {
    const [goal, setGoal] = useState("");
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const executeMission = async () => {
        if (!goal.trim()) return;
        setLoading(true);
        setReportData(null);
        setError(null);

        try {
            // Call the "War Room" endpoint defined in server.js
            const res = await axios.post(`${API_URL}/api/seyna/command`, { goal });
            setReportData(res.data);
        } catch (err) {
            setError("Seyna failed to establish connection with sub-agents.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Helper to find specific agent data from the response array
    const getAgentOutput = (agentName: string) => {
        if (!reportData?.team_reports) return null;
        return reportData.team_reports.find((r: any) => r.agent === agentName);
    };

    return (
        <div className="w-full max-w-6xl mx-auto mt-8 p-4">
            {/* Main Command Terminal */}
            <div className="bg-gray-950 text-green-500 p-6 rounded-xl shadow-2xl border border-green-900/50 backdrop-blur-md mb-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 border-b border-green-900/50 pb-4">
                    <div className="p-2 bg-green-900/30 rounded-lg border border-green-500/20 relative overflow-hidden">
                        <Cpu className="text-green-400 animate-pulse relative z-10" size={28} />
                        {loading && <div className="absolute inset-0 bg-green-500/20 animate-ping rounded-lg"></div>}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-widest font-mono text-white">SEYNA CORE</h2>
                        <p className="text-xs text-green-400/70 font-mono tracking-wider">SUPERVISOR // MULTI-AGENT ORCHESTRATOR</p>
                    </div>
                </div>

                {/* Input Area */}
                <div className="flex gap-3 mb-4">
                    <div className="relative flex-1">
                        <Terminal className="absolute left-3 top-3 text-gray-500" size={20} />
                        <input
                            value={goal}
                            onChange={e => setGoal(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && executeMission()}
                            placeholder="ENTER HIGH-LEVEL DIRECTIVE (e.g., 'Design a viral summer collection for Gen Z')"
                            className="w-full bg-gray-900/50 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-green-500 font-mono transition-colors"
                            disabled={loading}
                        />
                    </div>
                    <button
                        onClick={executeMission}
                        disabled={loading || !goal.trim()}
                        className={`px-8 py-3 rounded-lg font-bold font-mono flex items-center gap-2 transition-all
              ${loading ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-green-600 hover:bg-green-500 text-black shadow-lg shadow-green-900/30 hover:shadow-green-500/20'}
            `}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                        {loading ? 'EXECUTING...' : 'INITIALIZE'}
                    </button>
                </div>

                {error && <div className="text-red-400 font-mono p-3 bg-red-950/30 border border-red-900 rounded">{error}</div>}
            </div>


            {/* The Agent Team Cards Grid */}
            {(loading || reportData) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* 1. VOGUE (Creative) */}
                    <AgentCard
                        name="VOGUE"
                        role="Creative Director"
                        icon={<Palette size={24} />}
                        theme="pink"
                        loading={loading}
                        data={getAgentOutput("Vogue")}
                    />

                    {/* 2. LEDGER (Finance) */}
                    <AgentCard
                        name="LEDGER"
                        role="Chief Financial Officer"
                        icon={<CircleDollarSign size={24} />}
                        theme="amber"
                        loading={loading}
                        data={getAgentOutput("Ledger")}
                    />

                    {/* 3. ECHO (Marketing) */}
                    <AgentCard
                        name="ECHO"
                        role="Head of Marketing"
                        icon={<Megaphone size={24} />}
                        theme="cyan"
                        loading={loading}
                        data={getAgentOutput("Echo")}
                    />
                </div>
            )}
        </div>
    );
};


// Sub-Component for individual Agent Cards
const AgentCard = ({ name, role, icon, theme, loading, data }: { name: string, role: string, icon: any, theme: 'pink' | 'amber' | 'cyan', loading: boolean, data: any }) => {
    // Theme color maps for styling
    const colors = {
        pink: { border: 'border-pink-500/50', bg: 'bg-pink-950/30', text: 'text-pink-400', title: 'text-pink-300' },
        amber: { border: 'border-amber-500/50', bg: 'bg-amber-950/30', text: 'text-amber-400', title: 'text-amber-300' },
        cyan: { border: 'border-cyan-500/50', bg: 'bg-cyan-950/30', text: 'text-cyan-400', title: 'text-cyan-300' },
    };
    const c = colors[theme];

    return (
        <div className={`rounded-xl border ${c.border} ${c.bg} backdrop-blur-md overflow-hidden shadow-xl flex flex-col h-96 relative`}>
            {/* Header */}
            <div className={`p-4 ${c.bg} border-b ${c.border} flex items-center gap-3`}>
                <div className={`${c.text} p-2 rounded-lg bg-black/20`}>{icon}</div>
                <div>
                    <h3 className={`font-bold font-mono tracking-wider ${c.title}`}>{name}</h3>
                    <p className={`text-xs ${c.text} opacity-70 font-mono`}>{role}</p>
                </div>
            </div>

            {/* Body Content */}
            <div className="p-4 flex-1 overflow-y-auto bg-black/40 font-mono text-sm custom-scrollbar relative">
                {loading && !data ? (
                    <div className={`flex flex-col items-center justify-center h-full ${c.text} opacity-70 gap-3`}>
                        <Loader2 className="animate-spin" size={32} />
                        <span className="animate-pulse tracking-widest text-xs">ANALYZING DIRECTIVE...</span>
                    </div>
                ) : data ? (
                    // Displaying raw AI output text formatted nicely
                    <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                        {data.output.split('\n').map((line: string, i: number) => (
                            <p key={i} className="mb-2">{line}</p>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600 flex h-full items-center justify-center">Standby...</div>
                )}

                {/* Add a subtle scanline effect overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 mix-blend-overlay"></div>
            </div>
        </div>
    );
};

export default SeynaDashboard;
