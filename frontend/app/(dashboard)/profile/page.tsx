import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/database/mongoose";
import Outfit from "@/models/Outfit";
import Collection from "@/models/Collection";
import InstagramGrid from "@/components/shared/InstagramGrid";
import Link from "next/link";
import { Settings, Share2, Grid } from "lucide-react";

export default async function ProfilePage() {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) redirect("/sign-in");

    // Fetch Stats from DB
    await connectToDatabase();
    const outfits = await Outfit.find({ clerkId: userId }).sort({ createdAt: -1 });
    const collectionCount = await Collection.countDocuments({ clerkId: userId });

    return (
        <div className="max-w-md mx-auto pt-8 px-4 pb-24">
            {/* 1. Header Section */}
            <div className="flex flex-col items-center text-center mb-8">
                <div className="scale-125 mb-4 p-1 ring-2 ring-gray-100 rounded-full">
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-20 h-20"
                            }
                        }}
                    />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-500 text-sm">@{user?.username || user?.firstName?.toLowerCase()}</p>
            </div>

            {/* 2. Stats Row */}
            <div className="flex justify-around items-center py-4 mb-4">
                <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900">{outfits.length}</span>
                    <span className="text-xs text-gray-500">Outfits</span>
                </div>
                <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900">{collectionCount}</span>
                    <span className="text-xs text-gray-500">Collections</span>
                </div>
                <div className="text-center">
                    <span className="block text-xl font-bold text-gray-900">{user?.publicMetadata?.followers as number || 0}</span>
                    <span className="text-xs text-gray-500">Followers</span>
                </div>
            </div>

            {/* 3. Action Buttons */}
            <div className="flex gap-2 mb-8">
                <button className="flex-1 bg-gray-100 text-gray-900 font-semibold text-sm py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Edit Profile
                </button>
                <button className="flex-1 bg-gray-100 text-gray-900 font-semibold text-sm py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Share Profile
                </button>
            </div>

            {/* 4. Tabs (Grid vs Collections) */}
            <div className="flex border-t border-gray-200 mb-1">
                <Link href="/profile" className="flex-1 flex justify-center py-3 border-b-2 border-black">
                    <Grid className="w-6 h-6 text-black" />
                </Link>
                <Link href="/collections" className="flex-1 flex justify-center items-center py-3 border-b border-transparent hover:bg-gray-50 transition">
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-md" />
                </Link>
            </div>

            {/* 5. Grid */}
            <div className="mb-8">
                <InstagramGrid items={JSON.parse(JSON.stringify(outfits))} />
            </div>

            <div className="mt-12 text-center text-xs text-gray-300">
                Closet AI v1.0.0
            </div>
        </div>
    );
}
