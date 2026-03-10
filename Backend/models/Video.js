import mongoose from "mongoose";

// Define schema for Video collection
const videoSchema = new mongoose.Schema(
  {
    // Title of the video
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    // Description of the video
    description: {
      type: String,
      default: "",
    },
    // URL where the video file is stored
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    // Thumbnail image URL for the video preview
    thumbnailUrl: {
      type: String,
      required: [true, "Thumbnail URL is required"],
    },
    // Category of the video (restricted to predefined values)
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Music",
        "Gaming",
        "Education",
        "Sports",
        "News",
        "Entertainment",
        "Science & Tech",
        "Comedy",
      ],
    },
     // Reference to the channel that owns the video
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    // Reference to the user who uploaded the video
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Number of views the video has received
    views: {
      type: Number,
      default: 0,
    },
    // Array of users who liked the video &&  Array of users who disliked the video
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

// Create Video model using the schema
const Video = mongoose.model("Video", videoSchema);

export default Video;
