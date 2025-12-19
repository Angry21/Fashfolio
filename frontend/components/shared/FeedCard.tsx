"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Send, Bookmark } from "lucide-react";
import { useState } from "react";
import { toggleOutfitLike } from "@/lib/actions/outfit.actions";
import CommentSheet from "./CommentSheet";
import EditOutfitSheet from "./EditOutfitSheet";

// Define the interface for the post data
interface FeedPost {
    _id: string;
    imageUrl: string;
    description?: string;
    location?: string; // Optional: if you add location later
    author: {
        clerkId: string;
        username: string;
        photo: string;
    };
    likes: string[]; // Array of user IDs
    commentsCount: number;
    createdAt: string;
}

export default function FeedCard({ post, currentUserId }: { post: FeedPost; currentUserId: string }) {
    // Optimistic UI for Likes
    const [liked, setLiked] = useState(post.likes?.includes(currentUserId) || false);
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

    const handleLike = async () => {
        // Optimistic update
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

        try {
            await toggleOutfitLike(post._id, "/dashboard");
        } catch (error) {
            // Revert on error
            setLiked(!newLikedState);
            setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
            console.error("Like failed", error);
        }
    };

    return (
        <article className="bg-white border-b border-gray-100 md:border md:rounded-xl md:shadow-sm mb-4 md:mb-8 overflow-hidden">

            {/* 1. Header: User Info */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                    <Link href={`/profile/${post.author.clerkId}`} className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                        {/* Fallback image if user photo missing */}
                        <Image
                            src={post.author.photo || "/assets/placeholder-user.png"}
                            alt={post.author.username}
                            fill
                            className="object-cover"
                        />
                    </Link>
                    <div className="flex flex-col">
                        <Link href={`/profile/${post.author.clerkId}`} className="text-sm font-semibold hover:text-gray-600">
                            {post.author.username || "Unknown Style"}
                        </Link>
                        {post.location && <span className="text-xs text-gray-500">{post.location}</span>}
                    </div>
                </div>

                {/* Three dots menu (Placeholder) */}
                <button className="text-gray-400 hover:text-black">•••</button>
            </div>

            {/* 2. Main Image */}
            <div className="relative aspect-[4/5] w-full bg-gray-100">
                <Image
                    src={post.imageUrl}
                    alt="Post content"
                    fill
                    className="object-cover"
                    priority // Load prioritized images faster
                />
            </div>

            {/* 3. Action Bar */}
            <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-4 items-center">
                        <button onClick={handleLike} className="hover:opacity-60 transition-opacity">
                            <Heart
                                className={`w-7 h-7 transition-colors duration-200 ${liked ? "fill-red-500 text-red-500" : "text-black"}`}
                            />
                        </button>

                        {/* Comment Sheet Trigger */}
                        <CommentSheet outfitId={post._id} commentsCount={post.commentsCount} />

                        <button className="hover:opacity-60 transition-opacity">
                            <Send className="w-7 h-7 text-black" />
                        </button>
                    </div>
                    {/* 3. Actions: Delete & Edit (Author only) */}
                    {post.author.clerkId === currentUserId ? (
                        <div className="flex items-center gap-3">
                            {/* Edit Button */}
                            <EditOutfitSheet outfit={post} userId={currentUserId} />

                            {/* Delete Button */}
                            <button
                                onClick={async () => {
                                    if (confirm("Are you sure you want to delete this outfit?")) {
                                        const { deleteOutfit } = await import("@/lib/actions/outfit.actions");
                                        await deleteOutfit(post._id);
                                    }
                                }}
                                className="text-red-500 hover:text-red-600 transition-colors"
                                title="Delete Outfit"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button>
                            <Bookmark className="w-7 h-7 text-black" />
                        </button>
                    )}
                </div>

                {/* 4. Likes Count */}
                <div className="font-semibold text-sm mb-1">
                    {likesCount > 0 ? `${likesCount} likes` : "Be the first to like"}
                </div>

                {/* 5. Caption */}
                <div className="text-sm">
                    <span className="font-semibold mr-2">{post.author.username}</span>
                    <span className="text-gray-800">{post.description || "No description"}</span>
                </div>

                {/* 6. Comments Link */}
                {post.commentsCount > 0 && (
                    <button className="text-gray-500 text-sm mt-1">
                        View all {post.commentsCount} comments
                    </button>
                )}

                {/* 7. Timestamp */}
                <div className="text-[10px] text-gray-400 uppercase mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                </div>
            </div>
        </article>
    );
}
