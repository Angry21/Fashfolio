"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

// Helper for Cloudinary Upload
const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fashfolio_upload");
    formData.append("cloud_name", "drzyruuxr");

    const res = await axios.post(
        "https://api.cloudinary.com/v1_1/drzyruuxr/image/upload",
        formData
    );
    return res.data.secure_url;
};

interface Product {
    _id: string;
    title: string;
    designer: string;
    price: number;
    category: string;
    image?: string;
    trendScore: number;
    marketingBlurb?: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [form, setForm] = useState({
        title: '',
        designer: '',
        price: '',
        category: 'Streetwear'
    });
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/products`);
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "";
            if (imageFile) {
                // alert("Uploading image... please wait"); 
                // Using a simpler toast/indicator is better in modern apps, but sticking to user request or minimal valid behavior
                setImageFile(null); // Clear file input visual if possible, or handle via ref (simplified for now)

                imageUrl = await uploadToCloudinary(imageFile);
            }

            const productData = {
                ...form,
                price: Number(form.price), // Ensure number
                image: imageUrl
            };

            await axios.post(`${API_URL}/api/products`, productData);

            await fetchProducts();
            setForm({ title: '', designer: '', price: '', category: 'Streetwear' });
            setImageFile(null);
            alert("Product Uploaded!");

        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Product Manager</h1>

            {/* Upload Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 max-w-2xl mx-auto border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Product Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Oversized Hoodie"
                            className="w-full border p-2 rounded bg-gray-50"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Designer / Brand</label>
                            <input
                                type="text"
                                placeholder="e.g. Balenciaga"
                                className="w-full border p-2 rounded bg-gray-50"
                                value={form.designer}
                                onChange={(e) => setForm({ ...form, designer: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Price ($)</label>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full border p-2 rounded bg-gray-50"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            className="w-full border p-2 rounded bg-gray-50"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                            <option value="Streetwear">Streetwear</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Casual">Casual</option>
                            <option value="Formal">Formal</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Product Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                            className="w-full border p-2 rounded bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                        {imageFile && <p className="text-xs text-green-600 mt-1">Selected: {imageFile.name}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Add Product"}
                    </button>
                </form>
            </div>

            {/* Product Grid */}
            <h2 className="text-2xl font-bold mb-6">Current Collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <div key={p._id} className="border p-4 rounded shadow hover:shadow-lg transition bg-white flex flex-col relative">

                        {/* Image Section with Score Overlay */}
                        {p.image ? (
                            <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
                                <Image
                                    src={p.image}
                                    alt={p.title}
                                    fill
                                    className="object-cover"
                                />
                                {/* 🔥 TREND SCORE BADGE */}
                                {p.trendScore > 0 && (
                                    <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md border border-white/20 shadow-sm z-10">
                                        🔥 Score: {p.trendScore}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-gray-100 mb-4 rounded flex items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}

                        {/* Info Section */}
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
                                <p className="text-gray-500 text-sm">by {p.designer}</p>
                            </div>
                            <span className="font-mono text-lg font-semibold text-gray-700">${p.price}</span>
                        </div>

                        {/* ✨ MARKETING BLURB SECTION */}
                        {p.marketingBlurb && (
                            <div className="mt-3 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100">
                                <p className="text-purple-900 text-sm italic leading-relaxed">
                                    <span className="mr-2 not-italic">✨</span>
                                    "{p.marketingBlurb}"
                                </p>
                            </div>
                        )}

                        {/* Category Tag */}
                        <span className="inline-block mt-auto pt-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                            {p.category}
                        </span>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <p className="text-center text-gray-500 py-10">No products found. Add one above!</p>
            )}
        </div>
    );
}
