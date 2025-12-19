"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

interface GridItem {
    _id: string;
    imageUrl: string;
    context?: { mood?: string; season?: string };
}

export default function InstagramGrid({ items }: { items: GridItem[] }) {
    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-gray-300 fill-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No outfits yet</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                    Upload your first look to start building your digital closet.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5 md:gap-4">
            {items.map((item) => (
                <Link
                    href={`/outfit/${item._id}`}
                    key={item._id}
                    className="group relative block aspect-[3/4] bg-gray-100 overflow-hidden cursor-pointer"
                >
                    <Image
                        src={item.imageUrl}
                        alt={item.context?.mood || "Outfit"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 33vw, 20vw"
                    />

                    {/* Hover Overlay (Desktop Only) */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                        <Heart className="w-6 h-6 fill-white" />
                    </div>
                </Link>
            ))}
        </div>
    );
}
