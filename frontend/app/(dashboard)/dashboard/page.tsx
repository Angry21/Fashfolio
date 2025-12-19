import { getGlobalFeed } from "@/lib/actions/outfit.actions";
import { ensureUserExists, getSuggestedUsers } from "@/lib/actions/user.actions";
import FeedCard from "@/components/shared/FeedCard";
import WeatherPill from "@/components/shared/WeatherPill";
import AIUserList from "@/components/shared/AIUserList";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface SearchParams {
    feed?: 'all' | 'following';
    // other params...
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const { userId } = await auth();
    const { feed = 'all' } = await searchParams;

    // 1. LAZY SYNC: Ensure the current user is in our DB so they can like/comment
    await ensureUserExists();

    // 2. Fetch the Feed & Suggestions
    const feedPosts = await getGlobalFeed(feed);
    const suggestedUsers = await getSuggestedUsers();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const posts: any[] = feedPosts;

    return (
        <div className="max-w-md mx-auto w-full pb-24 pt-2">

            {/* 1. Top Bar: Weather + App Name */}
            <div className="flex justify-between items-end px-4 mb-4">
                {/* Real Weather Pill */}
                <WeatherPill />
                <div className="font-bold text-gray-900">Closet AI</div>
            </div>

            {/* 2. Main Title */}
            <div className="px-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Home Feed</h1>
            </div>

            {/* 3. Helper Widget (Weather full) - Hidden or kept? User mockup implies minimal header. 
          We'll keep the widget for functionality but maybe minimalize it later. 
          For now, let's keep it but maybe visually distinct. 
      */}
            {/* <div className="px-4 mb-4"> <WeatherWidget /> </div> */}
            {/* Commenting out large widget to match clean mockup look, assuming header is enough */}

            {/* 4. Tabs? Mockup doesn't show tabs, it shows just a feed. 
          But functionality requires tabs. Let's keep them small/subtle or hide if 'All' is default.
          Let's keep them but make them clean.
      */}
            <div className="flex px-4 gap-6 mb-6 border-b border-gray-100">
                <Link
                    href="/dashboard?feed=all"
                    className={`pb-3 text-sm font-semibold transition-all border-b-2 ${feed === 'all' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                >
                    Global
                </Link>
                <Link
                    href="/dashboard?feed=following"
                    className={`pb-3 text-sm font-semibold transition-all border-b-2 ${feed === 'following' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                >
                    Following
                </Link>
            </div>

            {/* Suggested Users (Real Data + AI Scoring) */}
            <div className="mb-4">
                <AIUserList initialUsers={suggestedUsers} />
            </div>

            {/* The original WeatherWidget was here, but it's now commented out in the new header structure. */}
            {/* <div className="px-4 mb-4">
                <WeatherWidget />
            </div> */}

            <div className="flex flex-col">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <FeedCard
                            key={post._id}
                            post={post}
                            currentUserId={userId || ""}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 px-6">
                        <h3 className="text-lg font-bold">
                            {feed === 'following' ? "No posts from friends yet 😔" : "Welcome to the Feed! 🌍"}
                        </h3>
                        <p className="text-gray-500 mt-2">
                            {feed === 'following'
                                ? "Follow some creators to see their outfits here!"
                                : "No public posts yet. Be the first to upload an outfit and share it with the world!"}
                        </p>
                        {feed === 'following' && (
                            <Link href="/dashboard?feed=all" className="inline-block mt-4 text-blue-600 font-semibold">
                                Find users in Global Feed
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
