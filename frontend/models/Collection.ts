import { Schema, model, models } from "mongoose";

const CollectionSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    clerkId: { type: String, required: true, index: true },
    // Array of references to the Outfit model
    outfits: [{ type: Schema.Types.ObjectId, ref: "Outfit" }],
}, { timestamps: true });

const Collection = models.Collection || model("Collection", CollectionSchema);

export default Collection;
