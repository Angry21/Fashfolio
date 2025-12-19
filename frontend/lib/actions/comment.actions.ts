"use server";

import { connectToDatabase } from "@/lib/database/mongoose";
import Comment from "@/models/Comment";
import Outfit from "@/models/Outfit";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function createComment({
    outfitId,
    content,
    path
}: {
    outfitId: string;
    content: string;
    path: string;
}) {
    try {
        const user = await currentUser();
        if (!user) throw new Error("Unauthorized");

        await connectToDatabase();

        const newComment = await Comment.create({
            content,
            outfitId,
            authorClerkId: user.id,
            authorName: user.username || user.firstName,
            authorAvatar: user.imageUrl,
        });

        // Increment comment count on Outfit
        await Outfit.findByIdAndUpdate(outfitId, {
            $inc: { commentsCount: 1 }
        });

        revalidatePath(path);
        return JSON.parse(JSON.stringify(newComment));
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
}

export async function getComments(outfitId: string) {
    try {
        await connectToDatabase();

        const comments = await Comment.find({ outfitId })
            .sort({ createdAt: -1 }); // Newest first

        return JSON.parse(JSON.stringify(comments));
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
}
