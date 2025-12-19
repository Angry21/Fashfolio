import { getAllOutfits } from "@/lib/actions/outfit.actions";
import InstagramGrid from "@/components/shared/InstagramGrid";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; season?: string; mood?: string }>;
}) {
    const resolvedParams = await searchParams;
    const query = resolvedParams.q || "";
    const activeSeason = resolvedParams.season || "";
    const activeMood = resolvedParams.mood || "";

    // Fetch filtered outfits (Global Discovery)
    const outfits = await getAllOutfits({
        searchQuery: query,
        season: activeSeason,
        mood: activeMood,
        scope: 'global'
    });

    const seasons = ["Spring", "Summer", "Fall", "Winter"];
    const moods = ["Casual", "Formal", "Party", "Sport", "Business"];

    return (
        <div className="w-full min-h-screen pb-20 pt-4">

            {/* Title */}
            <div className="px-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">Search & Explore</h1>
            </div>

            {/* 1. Sticky Search Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 py-2 border-b border-gray-100 -mx-4 px-4 md:mx-0 md:px-0 bg-white">

                {/* Search Input */}
                <form className="relative mb-4 px-4 md:px-0">
                    <SearchIcon className="absolute left-7 md:left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Search for inspiration..."
                        className="w-full bg-gray-100 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm font-medium"
                    />
                    {/* Hidden inputs to preserve other filters when searching */}
                    {activeSeason && <input type="hidden" name="season" value={activeSeason} />}
                    {activeMood && <input type="hidden" name="mood" value={activeMood} />}
                </form>

                {/* Scrollable Filter Chips */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <Link
                        href="/search"
                        className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border transition-all ${!activeSeason && !activeMood ? "bg-black text-white border-black" : "border-gray-200 hover:border-black text-gray-600"
                            }`}
                    >
                        All
                    </Link>

                    {/* Season Chips */}
                    {seasons.map((season) => (
                        <Link
                            key={season}
                            href={`/search?season=${season}&q=${query}`}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border transition-all ${activeSeason === season ? "bg-black text-white border-black" : "border-gray-200 hover:border-black text-gray-600"
                                }`}
                        >
                            {season}
                        </Link>
                    ))}

                    {/* Mood Chips (Visual separator) */}
                    <div className="w-px h-8 bg-gray-200 mx-2"></div>

                    {moods.map((mood) => (
                        <Link
                            key={mood}
                            href={`/search?mood=${mood}&q=${query}`}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border transition-all ${activeMood === mood ? "bg-black text-white border-black" : "border-gray-200 hover:border-black text-gray-600"
                                }`}
                        >
                            {mood}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 2. Results Grid */}
            <div className="mt-4">
                <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">
                    {outfits.length} Results Found
                </h2>
                <InstagramGrid items={outfits} />
            </div>
        </div>
    );
}
