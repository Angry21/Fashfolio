"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { ProductGrid } from "@/components/ProductGrid";
import { UploadModal } from "@/components/UploadModal";

const API_URL = "http://localhost:5000";
const CLOUD_NAME = "drzyruuxr";
const UPLOAD_PRESET = "fashfolio_upload";

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

export default function StudioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  // Form State
  const [form, setForm] = useState({ title: "", designer: "", price: "", category: "Streetwear" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", UPLOAD_PRESET);
        // formData.append("cloud_name", CLOUD_NAME); 

        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );
        imageUrl = uploadRes.data.secure_url;
      }

      const productData = { ...form, image: imageUrl };
      await axios.post(`${API_URL}/api/products`, productData);

      // Reset and Refresh
      setForm({ title: "", designer: "", price: "", category: "Streetwear" });
      setImageFile(null);
      setShowUpload(false);
      fetchProducts();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-black overflow-hidden mb-8">
        <Image
          src="/hero.png"
          alt="Future of Fashion"
          fill
          className="object-cover opacity-80 hover:scale-105 transition-transform duration-[2s]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 md:p-16">
          <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter mb-4 drop-shadow-2xl">
            THE NEW <br /> VANGUARD.
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-xl mb-6 font-light">
            Curate your digital wardrobe with AI-powered trend analysis. Welcome to the future of fashion portfolios.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-pink-600 hover:text-white transition-colors w-fit">
            Explore Collection
          </button>
        </div>
      </section>

      <ProductGrid
        items={products}
        onUploadClick={() => setShowUpload(true)}
      />

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSubmit={handleUpload}
          form={form}
          setForm={setForm}
          imageFile={imageFile}
          setImageFile={setImageFile}
          loading={loading}
        />
      )}
    </main>
  );
}
