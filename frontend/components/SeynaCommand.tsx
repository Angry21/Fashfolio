'use client';

import { useState } from 'react';
import axios from 'axios';
import { Terminal, Palette, DollarSign, Megaphone, Loader, CheckCircle } from 'lucide-react';

const SeynaCommand = () => {
    const [goal, setGoal] = useState("");
    const [status, setStatus] = useState("idle"); // idle, active, complete
    const [report, setReport] = useState<any>(null);

    const activateAgents = async () => {
        if (!goal) return;
        setStatus("active");
        setReport(null);

        try {
            // Assuming backend runs on port 5000 and we have a proxy or direct access. 
            // Adjust URL if needed (e.g., http://localhost:5000/api/seyna/command or /api/seyna/command if proxied)
            const res = await axios.post('http://localhost:5000/api/seyna/command', { goal });
            setReport(res.data);
            setStatus("complete");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-10 font-sans">

            {/* --- COMMAND CENTER HEADER --- */}
            <div className="bg-black text-white p-6 rounded-t-xl border-b-4 border-purple-600 flex justify-between items-center shadow-2xl">
                <div className="flex items-center gap-3">
                    <Terminal className="text-purple-400" size={32} />
                    <div>
                        <h2 className="text-2xl font-bold tracking-wider">SEYNA MAS</h2>
                        <p className="text-xs text-gray-400 font-mono">MULTI-AGENT SYSTEM // V1.0</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${status === 'active' ? 'bg-yellow-500 text-black animate-pulse' : 'bg-gray-800 text-gray-400'}`}>
                    {status === 'active' ? 'AGENTS DEPLOYED' : 'SYSTEM STANDBY'}
                </div>
            </div>

            {/* --- INPUT AREA --- */}
            <div className="bg-gray-900 p-6 flex gap-4">
                <input
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Enter Mission Protocol (e.g., 'Launch a Cyberpunk Winter Collection')"
                    className="flex-1 bg-gray-800 text-white border border-gray-700 p-4 rounded text-lg focus:outline-none focus:border-purple-500 transition"
                />
                <button
                    onClick={activateAgents}
                    disabled={status === 'active'}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {status === 'active' ? <Loader className="animate-spin" /> : 'INITIALIZE'}
                </button>
            </div>

            {/* --- AGENT CARDS (THE GRID) --- */}
            {status === 'complete' && report && report.team_reports && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-6 rounded-b-xl border border-gray-300">

                    {report.team_reports.map((agentReport: any, index: number) => {
                        // Determine colors based on agent name
                        let color = "bg-gray-100 text-gray-800 border-gray-300";
                        let Icon = Terminal;

                        if (agentReport.agent === 'Vogue') {
                            color = "bg-pink-100 text-pink-800 border-pink-300";
                            Icon = Palette;
                        } else if (agentReport.agent === 'Ledger') {
                            color = "bg-green-100 text-green-800 border-green-300";
                            Icon = DollarSign;
                        } else if (agentReport.agent === 'Echo') {
                            color = "bg-blue-100 text-blue-800 border-blue-300";
                            Icon = Megaphone;
                        }

                        return (
                            <AgentCard
                                key={index}
                                name={agentReport.agent.toUpperCase()}
                                role={agentReport.role}
                                icon={<Icon size={24} />}
                                color={color}
                                data={agentReport.output}
                            />
                        );
                    })}

                </div>
            )}
        </div>
    );
};

// Helper Component for the Cards
const AgentCard = ({ name, role, icon, color, data }: { name: string, role: string, icon: any, color: string, data: string }) => (
    <div className={`p-5 rounded-lg border-2 ${color} shadow-lg flex flex-col gap-3 transform transition hover:-translate-y-1`}>
        <div className="flex items-center gap-2 border-b border-black/10 pb-2 mb-2">
            {icon}
            <div>
                <h3 className="font-black text-lg">{name}</h3>
                <p className="text-xs opacity-70 uppercase tracking-tight">{role}</p>
            </div>
        </div>

        <div className="text-sm whitespace-pre-wrap font-medium font-mono leading-relaxed">
            {/* Display text output directly since agent returns string now */}
            {data}
        </div>
        <div className="mt-auto pt-2 flex justify-end">
            <CheckCircle size={16} className="opacity-50" />
        </div>
    </div>
);

export default SeynaCommand;
