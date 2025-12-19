
import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
    content: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },

    // Who wrote it
    authorClerkId: { type: String, required: true },
    authorName: { type: String }, // Cache name/avatar for speed
    authorAvatar: { type: String },

    // What post it belongs to
    outfitId: { type: Schema.Types.ObjectId, ref: "Outfit", required: true, index: true },
});

const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
