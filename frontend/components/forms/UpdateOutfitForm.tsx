"use client";

import { useForm } from "react-hook-form";
import { updateOutfit } from "@/lib/actions/outfit.actions";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { usePathname } from "next/navigation";

interface UpdateOutfitFormProps {
    outfitId: string;
    initialData: {
        season?: string;
        mood?: string;
        description?: string;
    };
}

interface FormData {
    season: string;
    mood: string;
    description: string;
}

export const UpdateOutfitForm = ({ outfitId, initialData }: UpdateOutfitFormProps) => {
    const [isPending, startTransition] = useTransition();
    const path = usePathname();

    const { register, handleSubmit, reset } = useForm<FormData>({
        defaultValues: {
            season: initialData.season || "",
            mood: initialData.mood || "",
            description: initialData.description || "",
        },
    });

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            await updateOutfit({
                outfitId,
                updates: data,
                path: path || `/outfit/${outfitId}`,
            });
            // Optional: Show toast success
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold">Edit Details</h3>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Season</label>
                <select
                    {...register("season")}
                    className="p-2 border rounded-md"
                >
                    <option value="">Select Season</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="fall">Fall</option>
                    <option value="winter">Winter</option>
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Mood</label>
                <input
                    {...register("mood")}
                    className="p-2 border rounded-md"
                    placeholder="e.g. Casual, Formal"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                    {...register("description")}
                    className="p-2 border rounded-md"
                    rows={3}
                    placeholder="Add some notes about this outfit..."
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => reset()} disabled={isPending}>
                    Reset
                </Button>
                <Button type="submit" disabled={isPending} className="bg-purple-600 hover:bg-purple-700 text-white">
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
};
