"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import OutfitForm from "@/components/forms/OutfitForm";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditOutfitSheet({ outfit, userId }: { outfit: any, userId: string }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSuccess = () => {
        setOpen(false);
        router.refresh();
    };

    // Transform outfit data to match form shape
    const initialData = {
        _id: outfit._id,
        imageUrl: outfit.imageUrl,
        publicId: outfit.publicId,
        mood: outfit.context?.mood || "",
        season: outfit.context?.season || "spring",
        description: outfit.description || "",
        isPublic: outfit.isPublic
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                    title="Edit Outfit"
                >
                    <Pencil className="w-6 h-6" />
                </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6 text-left">
                    <SheetTitle className="text-xl font-bold">Edit Look</SheetTitle>
                </SheetHeader>

                <OutfitForm
                    initialData={initialData}
                    userId={userId}
                    onSuccess={handleSuccess}
                />
            </SheetContent>
        </Sheet>
    );
}
