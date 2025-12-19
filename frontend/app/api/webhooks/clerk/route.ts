import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // 1. Get the Secret from Dashboard
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }

    // 2. Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", { status: 400 });
    }

    // 3. Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // 4. Verify the signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", { status: 400 });
    }

    // 5. Handle the Event
    const eventType = evt.type;

    if (eventType === "user.created") {
        const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username || `user_${id.slice(0, 5)}`, // Fallback if no username
            firstName: first_name,
            lastName: last_name,
            photo: image_url,
        };

        const newUser = await createUser(user);

        // Important: We should ideally update Clerk metadata with our new Mongo ID
        // but for now, we just return success
        if (newUser) {
            return NextResponse.json({ message: "OK", user: newUser });
        }
    }

    if (eventType === "user.updated") {
        const { id, image_url, first_name, last_name, username } = evt.data;

        const user = {
            firstName: first_name,
            lastName: last_name,
            username: username || "",
            photo: image_url,
        };

        const updatedUser = await updateUser(id, user);
        return NextResponse.json({ message: "OK", user: updatedUser });
    }

    if (eventType === "user.deleted") {
        const { id } = evt.data;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const deletedUser = await deleteUser(id!);
        return NextResponse.json({ message: "OK", user: deletedUser });
    }

    return new Response("", { status: 200 });
}
