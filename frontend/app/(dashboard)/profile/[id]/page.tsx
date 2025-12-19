
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/database/mongoose";
import Outfit from "@/models/Outfit";
import User from "@/models/User";
import InstagramGrid from "@/components/shared/InstagramGrid";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";
import { revalidatePath } from "next/cache";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function PublicProfilePage({ params }: Props) {
    const { id: targetUserId } = await params;

    // Auth Check
    const { userId: currentUserId } = await auth();

    // If viewing own profile, redirect to private profile
    if (currentUserId === targetUserId) {
        redirect("/profile");
    }

    await connectToDatabase();

    // Fetch Target User
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any = await User.findOne({ clerkId: targetUserId });

    if (!user) {
        return notFound();
    }

    // Fetch Public Outfits
    const outfits = await Outfit.find({ clerkId: targetUserId, isPublic: true }).sort({ createdAt: -1 });

    // Check implementation of followers: array of strings?
    // User model: followers: [{ type: String }]
    const isFollowing = currentUserId ? user.followers.includes(currentUserId) : false;

    // Server Actions for Button
    async function handleFollow() {
        "use server";
        if (!currentUserId) return; // Should likely redirect to login
        await followUser(targetUserId, `/profile/${targetUserId}`);
    }

    async function handleUnfollow() {
        "use server";
        if (!currentUserId) return;
        await unfollowUser(targetUserId, `/profile/${targetUserId}`);
    }

    return (
        <div className="max-w-md mx-auto pt-8 px-4 pb-24">
            {/* 1. Header Section */}
            <div className="flex flex-col items-center text-center mb-8">
                <div className="scale-125 mb-4 p-1 ring-2 ring-gray-100 rounded-full w-24 h-24 relative overflow-hidden">
                    <Image
                        src={user.photo || "/assets/placeholder-user.png"}
                        alt={user.username}
                        fill
                        className="object-cover"
                    />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-500 text-sm">@{user.username || "user"}</p>

                {/* Follow Button */}
                <form action={isFollowing ? handleUnfollow : handleFollow} className="mt-4 w-full px-12">
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg font-semibold transition-all ${isFollowing
                                ? "bg-gray-100 text-black border border-gray-200"
                                : "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                            }`}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </button>
                </form>
            </div>

            {/* 2. Stats Row */}
            <div className="flex justify-around items-center border-y border-gray-100 py-6 mb-8">
                <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900">{outfits.length}</span>
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Posts</span>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900">{user.followers?.length || 0}</span>
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Followers</span>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900">{user.following?.length || 0}</span>
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Following</span>
                </div>
            </div>

            {/* 3. Grid */}
            <div className="mb-8">
                <InstagramGrid items={JSON.parse(JSON.stringify(outfits))} />
            </div>

            {!currentUserId && (
                <div className="fixed bottom-0 left-0 w-full bg-black text-white p-4 text-center z-50">
                    <p className="text-sm">Sign in to follow @{user.username}</p>
                </div>
            )}
        </div>
    );
}
