"use server";

import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Collection from "@/models/Collection";
import Outfit from "@/models/Outfit"; // Required for population
import { revalidatePath } from "next/cache";

interface CreateCollectionParams {
    name: string;
    description?: string;
    outfitIds: string[];
}

export async function createCollection({ name, description, outfitIds }: CreateCollectionParams) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        await connectToDatabase();

        const newCollection = await Collection.create({
            name,
            description,
            clerkId: userId,
            outfits: outfitIds, // Array of _id strings
        });

        revalidatePath("/collections");
        return JSON.parse(JSON.stringify(newCollection));
    } catch (error) {
        console.error("Error creating collection:", error);
        throw error;
    }
}

export async function getUserCollections() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return [
                {
                    _id: "mock_col_1",
                    name: "Summer Vacation 2024",
                    description: "Ideas for the trip to Italy",
                    createdAt: new Date().toISOString(),
                    outfits: [
                        { _id: "m1", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" },
                        { _id: "m2", imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop" }
                    ]
                },
                {
                    _id: "mock_col_2",
                    name: "Office Chic",
                    description: "Professional but comfortable",
                    createdAt: new Date().toISOString(),
                    outfits: [
                        { _id: "m3", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop" }
                    ]
                }
            ];
        }

        await connectToDatabase();

        // Fetch collections and "inflate" the outfit data so we can see images
        const collections = await Collection.find({ clerkId: userId })
            .populate({
                path: "outfits",
                model: Outfit,
                select: "imageUrl context.season context.mood", // Only get what we need
            })
            .sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(collections));
    } catch (error) {
        console.error("Error fetching collections:", error);
        throw new Error("Failed to fetch collections");
    }
}

export async function getCollectionById(collectionId: string) {
    try {
        await connectToDatabase();

        const collection = await Collection.findById(collectionId)
            .populate({
                path: "outfits",
                model: Outfit,
                select: "imageUrl context.season context.mood description",
            });

        if (!collection) throw new Error("Collection not found");

        return JSON.parse(JSON.stringify(collection));
    } catch (error) {
        console.error("Error fetching collection:", error);
        return null;
    }
}
