"use server";

import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/models/User";
import { revalidatePath } from "next/cache";
import { currentUser, auth } from "@clerk/nextjs/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createUser(user: any) {
    try {
        await connectToDatabase();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUser(clerkId: string, user: any) {
    try {
        await connectToDatabase();
        const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
            new: true,
        });
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.log(error);
    }
}

export async function deleteUser(clerkId: string) {
    try {
        await connectToDatabase();
        const userToDelete = await User.findOne({ clerkId });
        if (!userToDelete) throw new Error("User not found");
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        revalidatePath("/");
        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        console.log(error);
    }
}

export async function ensureUserExists() {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    await connectToDatabase();
    // Check if user exists
    const existingUser = await User.findOne({ clerkId: clerkUser.id });

    if (existingUser) return JSON.parse(JSON.stringify(existingUser));

    // If not, create them on the fly
    const newUser = await User.create({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: clerkUser.username || `user_${clerkUser.id.slice(0, 5)}`,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        photo: clerkUser.imageUrl,
    });

    return JSON.parse(JSON.stringify(newUser));
}

export async function getPublicUser(clerkId: string) {
    try {
        await connectToDatabase();
        const user = await User.findOne({ clerkId });
        if (!user) return null;
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function followUser(targetUserId: string, path: string) {
    try {
        const currentUserData = await currentUser();
        if (!currentUserData) throw new Error("Unauthorized");

        await connectToDatabase();

        const currentUserId = currentUserData.id;

        // Add to target's followers list
        await User.findOneAndUpdate(
            { clerkId: targetUserId },
            { $addToSet: { followers: currentUserId } }
        );

        // Add to current user's following list
        await User.findOneAndUpdate(
            { clerkId: currentUserId },
            { $addToSet: { following: targetUserId } }
        );

        revalidatePath(path);
        return { success: true };
    } catch (error) {
        console.error("Follow error:", error);
        throw error;
    }
}

export async function unfollowUser(targetUserId: string, path: string) {
    try {
        const currentUserData = await currentUser();
        if (!currentUserData) throw new Error("Unauthorized");

        await connectToDatabase();

        const currentUserId = currentUserData.id;

        // Remove from target's followers list
        await User.findOneAndUpdate(
            { clerkId: targetUserId },
            { $pull: { followers: currentUserId } }
        );

        // Remove from current user's following list
        await User.findOneAndUpdate(
            { clerkId: currentUserId },
            { $pull: { following: targetUserId } }
        );

        revalidatePath(path);
        return { success: true };
    } catch (error) {
        console.error("Unfollow error:", error);
        throw error;
    }
}

export async function getSuggestedUsers(limit: number = 5) {
    try {
        const currentUserData = await currentUser();
        if (!currentUserData) return [];

        await connectToDatabase();

        // fetch users who are NOT the current user and are NOT already in the 'following' list (simplified)
        // ideally we filter by 'following' array, but for V1 just getting random other users is fine
        const users = await User.find({
            clerkId: { $ne: currentUserData.id }
        }).limit(limit);

        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function analyzeUsersWithAI() {
    try {
        await connectToDatabase();
        const { userId } = await auth(); // Ensure authenticated
        if (!userId) throw new Error("Unauthorized");

        // 1. Fetch users (limit to 10 for demo speed)
        const users = await User.find().limit(10).lean();

        // Sanitize for JSON transport
        const sanitizedUsers = JSON.parse(JSON.stringify(users));

        // 2. Call External Backend API (Render)
        // Use localhost for dev, or env var for prod
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

        const response = await fetch(`${BACKEND_URL}/api/score-users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sanitizedUsers),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend AI Error: ${errorText}`);
        }

        const results = await response.json();
        return results;

    } catch (error) {
        console.error("Error in AI analysis:", error);
        throw error;
    }
}
