import { getCollectionById } from "@/lib/actions/collection.actions";
import Image from "next/image";
import Link from "next/link";

export default async function PublicCollectionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const collection = await getCollectionById(id);

    if (!collection) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Collection Not Found</h1>
                <p className="text-gray-500 mt-2">This link might be invalid or the collection was deleted.</p>
                <Link href="/" className="mt-6 text-blue-600 hover:underline">
                    Go Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="font-bold text-xl tracking-tighter">
                        Closet AI.
                    </Link>
                    <Link href="/sign-up" className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition">
                        Get the App
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold tracking-wide uppercase mb-4">
                        Curated Collection
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        {collection.name}
                    </h1>
                    {collection.description && (
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            {collection.description}
                        </p>
                    )}
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                        <span>Created on {new Date(collection.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{collection.outfits.length} items</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {collection.outfits.map((outfit: any) => (
                        <div key={outfit._id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <Image
                                src={outfit.imageUrl}
                                alt="Outfit"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                <p className="text-white font-medium truncate">{outfit.description || "No description"}</p>
                                <p className="text-white/80 text-xs mt-1 capitalize">
                                    {outfit.context?.season} • {outfit.context?.mood}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="border-t py-12 text-center text-gray-400 text-sm">
                <p>Powered by <span className="text-black font-semibold">Closet AI</span></p>
            </footer>
        </div>
    );
}
