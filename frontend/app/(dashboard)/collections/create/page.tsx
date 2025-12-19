"use client";

import { useState, useEffect } from "react";
import { getAllOutfits } from "@/lib/actions/outfit.actions";
import { createCollection } from "@/lib/actions/collection.actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function CreateCollectionPage() {
    const { isSignedIn } = useAuth();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [outfits, setOutfits] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Fetch outfits on mount
    useEffect(() => {
        getAllOutfits({}).then(setOutfits);
    }, []);

    if (!isSignedIn) {
        return (
            <div className="wrapper flex-center flex-col min-h-[60vh] text-center gap-6">
                <div className="bg-purple-100 p-6 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-purple-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </div>
                <h2 className="h2-bold text-dark-600">Context Required</h2>
                <p className="p-16-regular text-gray-500 max-w-md">
                    You are browsing as a guest. To create your own collections and looks, you need to sign in.
                </p>
                <Link href="/sign-in" className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition">
                    Sign In to Create
                </Link>
            </div>
        );
    }

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!name || selectedIds.length === 0) return;

        setLoading(true);
        try {
            await createCollection({ name, description, outfitIds: selectedIds });
            router.push("/collections"); // Redirect to the list view
            router.refresh();
        } catch (error) {
            console.error("Failed to create collection", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="h1-bold text-dark-600">Create New Look</h1>
                    <p className="p-16-regular text-gray-500 mt-2">Select items to group into a collection</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={!name || selectedIds.length === 0 || loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full disabled:opacity-50 font-semibold transition-all shadow-md"
                >
                    {loading ? "Saving..." : `Save Collection (${selectedIds.length})`}
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm mb-8 space-y-4">
                {/* Name Input */}
                <input
                    type="text"
                    placeholder="Collection Name (e.g., Summer Vacation)"
                    className="w-full text-3xl font-bold border-none outline-none placeholder-gray-300 ring-0 focus:ring-0"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    placeholder="Add a description..."
                    className="w-full text-gray-500 border-none outline-none placeholder-gray-300 resize-none ring-0 focus:ring-0"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {outfits.map((outfit: any) => (
                    <div
                        key={outfit._id}
                        onClick={() => toggleSelection(outfit._id)}
                        className={`relative cursor-pointer rounded-xl overflow-hidden aspect-[3/4] group transition-all duration-200 ${selectedIds.includes(outfit._id)
                            ? "ring-4 ring-purple-500 scale-95 opacity-100"
                            : "hover:shadow-lg opacity-90 hover:opacity-100"
                            }`}
                    >
                        <Image
                            src={outfit.imageUrl}
                            alt="Item"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />

                        {/* Selection Overlay */}
                        <div className={`absolute inset-0 transition-colors ${selectedIds.includes(outfit._id) ? 'bg-purple-500/20' : 'bg-black/0 group-hover:bg-black/10'}`} />

                        {selectedIds.includes(outfit._id) && (
                            <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}

                        {/* Metadata Badge */}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-white text-xs truncate font-medium">
                                {outfit.context?.season} • {outfit.context?.mood}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {outfits.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p>No outfits found to add. Upload some first!</p>
                </div>
            )}
        </div>
    );
}
