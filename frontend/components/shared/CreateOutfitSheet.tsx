"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import OutfitForm from "@/components/forms/OutfitForm"; // Your existing form
import { PlusSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CreateOutfitSheet({
    triggerIconClass,
    isMobile = false
}: {
    triggerIconClass?: string,
    isMobile?: boolean
}) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { userId } = useAuth(); // Client-side auth check

    // Function to close sheet when form submits successfully
    const handleSuccess = () => {
        setOpen(false);
        router.refresh(); // Refresh feed
    };

    if (!userId) {
        // If guest, maybe link to sign in or show different trigger?
        // For now, let's keep it but Form will handle block or we can redirect
        return (
            <button
                onClick={() => router.push('/sign-in')}
                className={isMobile ? "flex flex-col items-center gap-1 p-2" : "flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-all w-full group"}
            >
                <PlusSquare className={triggerIconClass || "w-6 h-6"} />
                {!isMobile && <span className="font-medium">Add</span>}
            </button>
        );
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {/* The Trigger Button */}
                <button className={isMobile ? "flex flex-col items-center gap-1 p-2" : "flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 text-gray-600 transition-all w-full group"}>
                    <PlusSquare className={triggerIconClass || "w-6 h-6"} />
                    {!isMobile && <span className="font-medium">Add</span>}
                </button>
            </SheetTrigger>

            {/* The Content Drawer */}
            <SheetContent side={isMobile ? "bottom" : "right"} className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6 text-left">
                    <SheetTitle className="text-xl font-bold">New Look</SheetTitle>
                </SheetHeader>

                {/* Pass a success callback to your form if you want it to close auto */}
                <OutfitForm onSuccess={handleSuccess} userId={userId} />
            </SheetContent>
        </Sheet>
    );
}
