
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    photo: { type: String },

    // --- SOCIAL GRAPH ---
    isDesigner: { type: Boolean, default: false }, // To highlight designers later
    followers: [{ type: String }], // Array of Clerk IDs following this user
    following: [{ type: String }], // Array of Clerk IDs this user follows
    // --------------------

}, { timestamps: true });

const User = models.User || model("User", UserSchema);
export default User;
