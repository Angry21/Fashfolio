"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "../shared/ImageUpload";
import { createOutfit, updateOutfit } from "@/lib/actions/outfit.actions";
import { useRouter } from "next/navigation";

// Define the shape of our form data
// Define the shape of our form data
interface OutfitFormData {
    imageUrl: string;
    publicId?: string;
    mood: string;
    season: string;
    description: string;
    occasion?: string[];
    isPublic: boolean;
    weather?: {
        temperature?: number;
    };
    _id?: string; // For updates
}

interface OutfitFormProps {
    userId: string;
    onSuccess?: () => void;
    initialData?: OutfitFormData; // For Edit Mode
}

const OutfitForm = ({ userId, onSuccess, initialData }: OutfitFormProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OutfitFormData>({
        defaultValues: initialData || {
            imageUrl: "",
            mood: "",
            season: "spring",
            description: "",
            isPublic: true // Default to true as per user flow
        }
    });

    const imageUrl = watch("imageUrl");

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Custom handler for the ImageUpload component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setCustomValue = async (url: string, publicId?: string) => {
        setValue('imageUrl', url, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
        if (publicId) {
            setValue('publicId', publicId);
        }

        // Trigger AI Analysis
        if (url) {
            setIsAnalyzing(true);
            try {
                const analyzeImage = (await import("@/lib/actions/image.actions")).analyzeImage;
                const analysis = await analyzeImage(url);

                if (analysis) {
                    if (analysis.season) setValue('season', analysis.season.toLowerCase());
                    if (analysis.mood) setValue('mood', analysis.mood);
                    if (analysis.description) setValue('description', analysis.description);
                }
            } catch (error) {
                console.error("AI Auto-tagging failed:", error);
            } finally {
                setIsAnalyzing(false);
            }
        }
    };

    const onSubmit = async (data: OutfitFormData) => {
        try {
            setLoading(true);

            if (initialData && initialData._id) {
                // --- UPDATE MODE ---
                await updateOutfit({
                    outfitId: initialData._id,
                    updates: {
                        mood: data.mood,
                        season: data.season,
                        description: data.description
                    },
                    path: '/dashboard' // we should ideally invalidate both, action handles path
                });
            } else {
                // --- CREATE MODE ---
                await createOutfit({
                    imageUrl: data.imageUrl,
                    publicId: data.publicId,
                    mood: data.mood,
                    season: data.season,
                    isPublic: data.isPublic,
                    // Passing simplified data for MVP. The detailed schema handles complexity.
                    items: [],
                    context: {
                        mood: data.mood,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        season: data.season as any,
                        occasion: [],
                        weather: {}
                    }
                });
            }

            if (onSuccess) {
                onSuccess();
            }

            // router.push("/dashboard"); // No longer needed if using Drawer
            router.refresh();
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto p-4">

            {/* 1. Image Upload */}
            <div>
                <div>
                    <label className="block text-sm font-medium mb-2">Outfit Photo</label>
                    <ImageUpload
                        value={imageUrl || ''}
                        disabled={loading}
                        onChange={(url, publicId) => setCustomValue(url, publicId)}

                    />
                    {isAnalyzing && (
                        <div className="flex items-center gap-2 text-purple-600 font-medium animate-pulse mt-2">
                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            AI Stylist is analyzing colors and mood...
                        </div>
                    )}
                    {errors.imageUrl && <p className="text-red-500 text-sm">Image is required</p>}
                </div>      </div>

            {/* 2. Basic Context Tags */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Season</label>
                    <select
                        {...register("season")}
                        className="w-full py-2 border-b border-gray-200 bg-transparent focus:outline-none focus:border-black rounded-none appearance-none"
                    >
                        <option value="spring">Spring</option>
                        <option value="summer">Summer</option>
                        <option value="fall">Fall</option>
                        <option value="winter">Winter</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Mood</label>
                    <input
                        {...register("mood", { required: true })}
                        className="w-full py-2 border-b border-gray-200 bg-transparent focus:outline-none focus:border-black rounded-none px-0"
                        placeholder="e.g. Party, Casual"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                    <input
                        {...register("description")}
                        className="w-full py-2 border-b border-gray-200 bg-transparent focus:outline-none focus:border-black rounded-none px-0"
                        placeholder="Say something about this look..."
                    />
                </div>
            </div>

            {/* 3. Social Privacy Toggle */}
            <div className="flex items-center justify-between py-4">
                <div>
                    <h3 className="font-medium text-gray-900">Make Public?</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        {...register("isPublic")}
                    />
                    <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 disabled:opacity-50 transition fixed bottom-6 left-4 right-4 max-w-xl mx-auto md:relative md:bottom-auto md:left-auto md:right-auto"
            >
                {loading ? (initialData ? "Updating..." : "Posting...") : (initialData ? "Update Look" : "Post")}
            </button>
        </form>
    );
};

export default OutfitForm;
