
import { Schema, model, models } from "mongoose";

const OutfitSchema = new Schema({
    clerkId: { type: String, required: true, index: true },
    imageUrl: { type: String, required: true },
    publicId: { type: String },
    season: { type: String },
    mood: { type: String },
    description: { type: String },

    items: { type: Array, default: [] }, // Keeping existing field for compatibility
    context: { type: Object, default: {} }, // Keeping existing field for compatibility
    wearDate: { type: Date, default: Date.now }, // Keeping existing field for compatibility

    // --- NEW SOCIAL FIELDS ---
    isPublic: { type: Boolean, default: true }, // Default to public for the social feed
    likes: [{ type: String }], // Array of Clerk IDs who liked this post
    commentsCount: { type: Number, default: 0 }, // Optimization for feed view
    // -------------------------

}, { timestamps: true });

const Outfit = models.Outfit || model("Outfit", OutfitSchema);
export default Outfit;
