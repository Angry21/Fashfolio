import { NextResponse } from "next/server";
import { createOutfit, getAllOutfits } from "@/lib/actions/outfit.actions";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newOutfit = await createOutfit(body);
        return NextResponse.json(newOutfit);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create outfit" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const outfits = await getAllOutfits();
        return NextResponse.json(outfits);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch outfits" }, { status: 500 });
    }
}
