import { Sparkles, Upload } from "lucide-react";

interface Product {
    _id: string;
    title: string;
    designer: string;
    price: number;
    category: string;
    image?: string;
    trendScore?: number;
    marketingBlurb?: string;
    aiTags?: string[];
    visualScore?: number;
    dominantColor?: string;
    fabricType?: string;
}

interface ProductGridProps {
    items: Product[];
    onUploadClick: () => void;
}

export const ProductGrid = ({ items, onUploadClick }: ProductGridProps) => {
    return (
        <div className="p-8 max-w-7xl mx-auto pb-32">
            {/* Hero Header */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">The Studio</h1>
                    <p className="text-gray-500 font-medium">Curate your collection and analyze trends.</p>
                </div>
                <button
                    onClick={onUploadClick}
                    className="bg-black text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    New Drop <Upload size={18} />
                </button>
            </div>

            {/* MASONRY GRID */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {items.map((p) => (
                    <div key={p._id} className="break-inside-avoid bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">

                        {/* Image */}
                        <div className="relative">
                            {p.image ? (
                                <img src={p.image} alt={p.title} className="w-full object-cover" />
                            ) : (
                                <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 font-mono">No Image</div>
                            )}

                            {/* Trend Badge */}
                            {p.trendScore && p.trendScore > 0 ? (
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-black text-xs font-black px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                                    <Sparkles size={12} className="text-amber-500" />
                                    {p.trendScore}
                                </div>
                            ) : null}
                        </div>

                        {/* Info */}
                        <div className="p-6">
                            {/* Title and Price Header */}
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg leading-tight">{p.title}</h3>
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded-md">${p.price}</span>
                            </div>

                            {/* NEW: PIXEL TAGS DISPLAY */}
                            {p.aiTags && p.aiTags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {/* Show Fabric Type as a distinct badge */}
                                    {p.fabricType && (
                                        <span className="text-[10px] uppercase font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                                            {p.fabricType}
                                        </span>
                                    )}

                                    {/* Show Style Tags */}
                                    {p.aiTags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                                            {tag}
                                        </span>
                                    ))}

                                    {/* Visual Score Badge */}
                                    {p.visualScore !== undefined && p.visualScore > 0 && (
                                        <span className="text-[10px] font-bold px-2 py-1 bg-pink-50 text-pink-600 rounded-md border border-pink-100 flex items-center gap-1">
                                            👁️ {p.visualScore}/10
                                        </span>
                                    )}
                                </div>
                            )}

                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">{p.category}</p>

                            {/* AI Insight */}
                            {p.marketingBlurb && (
                                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100/50">
                                    <p className="text-purple-900 text-xs italic leading-relaxed">
                                        <span className="font-bold not-italic mr-1">✨ AI Insight:</span>
                                        "{p.marketingBlurb}"
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
