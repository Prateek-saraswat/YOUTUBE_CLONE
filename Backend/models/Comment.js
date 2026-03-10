// models/Comment.js – Comment model
import mongoose from "mongoose";

// Define schema for Comment collection
const commentSchema = new mongoose.Schema(
    {
         // Reference to the video on which the comment is made
        video: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
        // Reference to the user who wrote the comment
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Actual comment text
        text: {
            type: String,
            required: [true, "Comment text is required"],
            trim: true,
        },
    },
    { timestamps: true }
     // Automatically adds createdAt and updatedAt fields
);

// Create Comment model using the schema
const Comment = mongoose.model("Comment", commentSchema);

export default Comment