import { getUserCollections } from "@/lib/actions/collection.actions";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
    const collections = await getUserCollections();

    return (
        <div className="wrapper">
            <div className="flex justify-between items-center mb-8">
                <h1 className="h1-bold text-dark-600">Virtual Wardrobe</h1>
                <Link
                    href="/collections/create"
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
                >
                    + New Collection
                </Link>
            </div>

            {collections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {collections.map((collection: any) => (
                        <div key={collection._id} className="border rounded-2xl overflow-hidden hover:shadow-md transition bg-white flex flex-col h-full">
                            {/* Collage Header */}
                            <div className="h-64 bg-gray-100 relative grid grid-cols-2 gap-0.5 pointer-events-none">
                                {collection.outfits.slice(0, 4).map((outfit: any, index: number) => (
                                    <div key={outfit._id || index} className="relative w-full h-full">
                                        <Image
                                            src={outfit.imageUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                                {collection.outfits.length === 0 && (
                                    <div className="col-span-2 flex items-center justify-center text-gray-400">
                                        Empty Collection
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-1">{collection.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{collection.description || "No description"}</p>
                                <div className="flex justify-between items-center text-xs font-medium text-gray-500 pt-4 border-t">
                                    <span>{collection.outfits.length} items</span>
                                    <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-center flex-col gap-4 py-20 text-center">
                    <h3 className="h3-bold text-gray-500">Your wardrobe is empty!</h3>
                    <p className="p-16-regular text-gray-400 max-w-md">
                        Create collections to organize your outfits into looks (e.g., "Summer Trip", "Office Wear").
                    </p>
                    <Link
                        href="/collections/create"
                        className="mt-4 text-purple-600 font-semibold hover:underline"
                    >
                        Start your first collection &rarr;
                    </Link>
                </div>
            )}
        </div>
    );
}
