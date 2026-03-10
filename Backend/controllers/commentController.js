import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// 1. Add Comment
export const addComment = async (req, res) => {
    try {

        // Extract videoId from URL parameters and comment text from request body
        const { videoId } = req.params; 
        const { text } = req.body;

        // Validate that comment text is provided
        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        // video exists check
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Create a new comment document
        const newComment = await Comment.create({
            text,
            user: req.user._id,
            video: videoId,
        });

        // Populate user details (username and avatar) for the response
        const populatedComment = await Comment.findById(newComment._id)
            .populate("user", "username avatar");

            // Send success response
        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment,
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: error.message });
    }
};

// 2. Get Comments for a Video
export const getComments = async (req, res) => {
    try {
        // Extract videoId from URL parameters
        const { videoId } = req.params; 

        // Find all comments related to the video
        const comments = await Comment.find({ video: videoId })
            .populate("user", "username avatar")
            .sort({ createdAt: -1 }); 

             // Send comments list
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Update Comment
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params; // commentId
        const { text } = req.body;

        // Validate comment text
        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        // Find the comment in the database
        const comment = await Comment.findById(id);

        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

         // Ensure the logged-in user is the owner of the comment
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Update the comment text
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { text },
            { new: true }
        );

        // Populate user details for response
        const populatedComment = await Comment.findById(updatedComment._id)
            .populate("user", "username avatar");

            // Send updated comment
        res.status(200).json({
            message: "Comment updated successfully",
            comment: populatedComment,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Delete Comment
export const deleteComment = async (req, res) => {
    try {
        // Extract comment ID from request parameters
        const { id } = req.params; 

        // Find the comment in the database
        const comment = await Comment.findById(id);

         // Check if comment exists
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Ensure that only the comment owner can delete it
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Delete the comment
        await Comment.findByIdAndDelete(id);

        // Send success response
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
