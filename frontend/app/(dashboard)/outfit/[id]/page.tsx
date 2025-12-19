
import { getOutfitById } from "@/lib/actions/outfit.actions";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import User from "@/models/User";
import FeedCard from "@/components/shared/FeedCard";

export default async function OutfitPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { userId } = await auth();

    const outfit = await getOutfitById(id);

    // Hydrate Author
    await connectToDatabase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const author: any = await User.findOne({ clerkId: outfit.clerkId });

    // Construct Post Object compliant with FeedCard
    const post = {
        ...outfit,
        _id: outfit._id.toString(),
        createdAt: outfit.createdAt ? new Date(outfit.createdAt).toISOString() : new Date().toISOString(),
        author: {
            clerkId: outfit.clerkId,
            username: author?.username || "Unknown",
            photo: author?.photo || ""
        }
    };

    return (
        <div className="max-w-md mx-auto py-8 px-4">
            <FeedCard post={post} currentUserId={userId || ""} />
        </div>
    );
}
