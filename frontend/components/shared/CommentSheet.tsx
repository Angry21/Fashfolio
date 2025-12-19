"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { MessageCircle, Send } from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { createComment, getComments } from "@/lib/actions/comment.actions";
import Image from "next/image";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CommentSheet({ outfitId, commentsCount }: { outfitId: string, commentsCount: number }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isPending, startTransition] = useTransition();

    // Fetch comments when sheet opens (naive approach: fetch on mount but only visible when open)
    // Better: Fetch when open state changes. For now, we'll fetch on mount of this component, 
    // which effectively means fetching when the parent FeedCard renders? No, that's bad.
    // We should fetch only when open.
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            getComments(outfitId).then(setComments);
        }
    }, [open, outfitId]);

    const handleSend = async () => {
        if (!newComment.trim()) return;

        startTransition(async () => {
            await createComment({
                outfitId,
                content: newComment,
                path: "/dashboard" // Revalidate dashboard
            });
            setNewComment("");
            // Refresh comments
            getComments(outfitId).then(setComments);
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="hover:opacity-60 transition-opacity flex items-center gap-1">
                    <MessageCircle className="w-7 h-7 -rotate-90 text-black" />
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl p-0 flex flex-col">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="text-center text-sm font-bold">Comments</SheetTitle>
                </SheetHeader>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {comments.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">
                            No comments yet. Start the conversation!
                        </div>
                    ) : (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        comments.map((comment: any) => (
                            <div key={comment._id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
                                    <Image
                                        src={comment.authorAvatar || "/assets/placeholder-user.png"}
                                        alt="User"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm">
                                        <span className="font-semibold mr-2">{comment.authorName}</span>
                                        {comment.content}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white pb-safe">
                    <div className="flex items-center gap-2">
                        <input
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isPending || !newComment.trim()}
                            className="text-blue-500 font-semibold disabled:opacity-50 p-2"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
