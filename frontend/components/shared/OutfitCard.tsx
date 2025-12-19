"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { deleteOutfit } from "@/lib/actions/outfit.actions";

interface OutfitProps {
    outfit: {
        _id: string;
        imageUrl: string;
        context?: {
            mood?: string;
            season?: string;
        };
    };
}

const OutfitCard = ({ outfit }: OutfitProps) => {
    const [isPending, startTransition] = useTransition();

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to detail page
        e.stopPropagation();

        if (confirm("Are you sure you want to delete this outfit?")) {
            startTransition(async () => {
                await deleteOutfit(outfit._id);
            });
        }
    };

    return (
        <li className="relative break-inside-avoid w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow group">
            <Link href={`/outfit/${outfit._id}`} className="flex flex-col gap-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                    <Image
                        src={outfit.imageUrl.replace('/upload/', '/upload/w_400,h_400,c_fill/')}
                        alt="Outfit"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Trash Icon - Visible on Hover */}
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 text-red-600 disabled:opacity-50"
                    >
                        {isPending ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        )}
                    </button>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        {outfit.context?.mood && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                {outfit.context.mood}
                            </span>
                        )}
                        {outfit.context?.season && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {outfit.context.season}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </li>
    );
};

export default OutfitCard;
