
"use server";

import { connectToDatabase } from "@/lib/database/mongoose";
import Outfit from "@/models/Outfit";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CreateOutfitParams {
    imageUrl: string;
    publicId?: string;
    mood: string;
    season: string;
    isPublic?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any;
}

export async function createOutfit(params: CreateOutfitParams) {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("Unauthorized");
        }

        await connectToDatabase();

        const newOutfit = await Outfit.create({
            clerkId: userId,
            imageUrl: params.imageUrl,
            publicId: params.publicId,
            items: params.items,
            context: params.context,
            isPublic: params.isPublic ?? true, // Default to true if not provided (legacy)
            wearDate: new Date(),
        });

        revalidatePath("/dashboard");
        revalidatePath("/profile");

        return JSON.parse(JSON.stringify(newOutfit));
    } catch (error) {
        console.error("Error creating outfit:", error);
        throw error;
    }
}

export async function deleteOutfit(outfitId: string) {
    try {
        const { userId } = await auth();

        if (!userId) {
            throw new Error("Unauthorized");
        }

        await connectToDatabase();

        const outfitToDelete = await Outfit.findOne({ _id: outfitId, clerkId: userId });

        if (!outfitToDelete) {
            throw new Error("Outfit not found or unauthorized");
        }

        if (outfitToDelete.publicId) {
            await cloudinary.uploader.destroy(outfitToDelete.publicId);
        }

        await Outfit.findByIdAndDelete(outfitId);

        revalidatePath("/dashboard");
        revalidatePath("/profile");

        return { success: true };
    } catch (error) {
        console.error("Error deleting outfit:", error);
        throw error;
    }
}

export async function getAllOutfits({
    searchQuery,
    season,
    mood,
    page = 1,
    limit = 20,
    userId, // Optional filter by specific user
    isFeed = false, // IF true, fetch public outfits from everyone (Legacy flag, consider using scope)
    scope = 'personal' // 'personal' | 'global'
}: {
    searchQuery?: string;
    season?: string;
    mood?: string;
    page?: number;
    limit?: number;
    userId?: string;
    isFeed?: boolean;
    scope?: 'personal' | 'global';
} = {}) {
    try {
        await connectToDatabase();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        if (scope === 'global' || isFeed) {
            query.isPublic = true;
            // If userId is provided in global scope, it filters strictly by that user (Public Profile view)
            if (userId) {
                query.clerkId = userId;
            }
        } else {
            // Personal Scope
            if (userId) {
                query.clerkId = userId;
            } else {
                const { userId: currentUserId } = await auth();
                if (!currentUserId) return []; // Guest cannot view personal
                query.clerkId = currentUserId;
            }
        }

        if (season && season !== 'all') {
            query['context.season'] = season;
        }

        if (mood && mood !== 'all') {
            query['context.mood'] = mood;
        }

        if (searchQuery) {
            query.$or = [
                { description: { $regex: searchQuery, $options: 'i' } },
                { 'context.mood': { $regex: searchQuery, $options: 'i' } }
            ];
        }

        const outfits = await Outfit.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);

        return JSON.parse(JSON.stringify(outfits));
    } catch (error) {
        console.error("Error fetching outfits:", error);
        throw new Error("Failed to fetch outfits");
    }
}

export async function getOutfitById(outfitId: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();
        const outfit = await Outfit.findOne({ _id: outfitId, clerkId: userId });

        if (!outfit) throw new Error("Outfit not found");

        return JSON.parse(JSON.stringify(outfit));
    } catch (error) {
        console.error("Error fetching outfit details:", error);
        throw new Error("Failed to fetch outfit details");
    }
}

export async function updateOutfit({
    outfitId,
    updates,
    path
}: {
    outfitId: string;
    updates: { season?: string; mood?: string; description?: string };
    path: string;
}) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateQuery: any = {};
        if (updates.season) updateQuery['context.season'] = updates.season;
        if (updates.mood) updateQuery['context.mood'] = updates.mood;
        if (updates.description) updateQuery.description = updates.description;

        const updatedOutfit = await Outfit.findOneAndUpdate(
            { _id: outfitId, clerkId: userId },
            { $set: updateQuery },
            { new: true }
        );

        if (!updatedOutfit) throw new Error("Outfit not found or unauthorized");

        revalidatePath(path);
        return JSON.parse(JSON.stringify(updatedOutfit));
    } catch (error) {
        console.error("Error updating outfit:", error);
        throw new Error("Failed to update outfit");
    }
}

export async function getGlobalFeed(filter: 'all' | 'following' = 'all') {
    await connectToDatabase();

    // Import User model dynamically to avoid circular dependency if any, or just standard import
    // Note: In Next.js server actions, sometimes top-level imports are fine. 
    // We'll use dynamic import to be safe as per previous context or standard if User is not used elsewhere.
    // Actually, let's use the standard import style but inside if needed, or just import at top if I could edits top.
    // Since I am only appending, I will use dynamic import.
    const User = (await import("@/models/User")).default;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { isPublic: true };

    if (filter === 'following') {
        const { userId } = await auth();
        if (userId) {
            // Get current user's following list
            const currentUserData = await User.findOne({ clerkId: userId });
            if (currentUserData && currentUserData.following.length > 0) {
                // Filter posts where clerkId is IN the following array
                query.clerkId = { $in: currentUserData.following };
            } else {
                // Following no one? Return empty or maybe just keep empty query (which means all)? 
                // Usually means return empty array if following count is 0.
                return [];
            }
        } else {
            // Guest cant view following feed
            return [];
        }
    }

    const rawPosts = await Outfit.find(query).sort({ createdAt: -1 }).limit(20);

    // Map and fetch user data for each post (Parallel fetch for speed)
    const feedWithAuthors = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawPosts.map(async (post: any) => {
            const author = await User.findOne({ clerkId: post.clerkId }).select("username photo clerkId");
            return {
                ...post._doc,
                _id: post._id.toString(),
                createdAt: post.createdAt.toISOString(),
                author: author || { username: "Unknown", photo: "", clerkId: post.clerkId } // Fallback
            };
        })
    );

    return JSON.parse(JSON.stringify(feedWithAuthors));
}

export async function toggleOutfitLike(outfitId: string, path: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        const outfit = await Outfit.findById(outfitId);
        if (!outfit) throw new Error("Outfit not found");

        // Check if user has already liked
        const isLiked = outfit.likes.includes(userId);

        if (isLiked) {
            // Unlike
            await Outfit.findByIdAndUpdate(outfitId, {
                $pull: { likes: userId }
            });
        } else {
            // Like
            await Outfit.findByIdAndUpdate(outfitId, {
                $push: { likes: userId }
            });
        }

        revalidatePath(path);
    } catch (error) {
        console.error("Error toggling like:", error);
        throw error;
    }
}
