import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Placeholder for fetching single outfit
    return NextResponse.json({ id, name: "Outfit 1" });
}
