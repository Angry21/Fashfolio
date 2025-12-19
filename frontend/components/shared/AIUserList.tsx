"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { analyzeUsersWithAI } from "@/lib/actions/user.actions";
import { Sparkles } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AIUserList({ initialUsers }: { initialUsers: any[] }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [users, setUsers] = useState<any[]>(initialUsers);
    const [loading, setLoading] = useState(false);

    const runAI = async () => {
        setLoading(true);
        try {
            // Call server action that runs Python
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const scoredUsers: any = await analyzeUsersWithAI();
            setUsers(scoredUsers);
        } catch (error) {
            console.error(error);
            alert("AI Analysis failed. Make sure Python is installed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Suggested Creators</h3>
                <button
                    onClick={runAI}
                    disabled={loading}
                    className="group bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-bold transition-all hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                    <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : "group-hover:animate-pulse"}`} />
                    {loading ? "Analyzing..." : "AI Score"}
                </button>
            </div>

            <div className="space-y-4">
                {users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between group">
                        <Link href={`/profile/${user.clerkId}`} className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100">
                                <Image
                                    src={user.photo}
                                    alt={user.username}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold group-hover:text-blue-600 transition-colors">
                                    {user.username}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {user.firstName} {user.lastName}
                                </span>
                            </div>
                        </Link>

                        {/* Score Badge (Only visible after AI run) */}
                        {user.ai_score !== undefined && (
                            <div className="flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-500">
                                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                                    {Math.round(user.ai_score)} pts
                                </span>
                                <span className="text-[9px] text-gray-400">Potential</span>
                            </div>
                        )}

                        {/* Default Follow button if no score yet */}
                        {user.ai_score === undefined && (
                            <Link
                                href={`/profile/${user.clerkId}`}
                                className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-900 px-3 py-1.5 rounded-lg transition-colors font-medium"
                            >
                                View
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 text-center">
                <Link href="/search" className="text-xs text-gray-400 hover:text-black transition-colors">
                    See all suggestions
                </Link>
            </div>
        </div>
    );
}
