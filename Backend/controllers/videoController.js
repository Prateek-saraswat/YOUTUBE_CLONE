import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// 1. Upload Video
export const uploadVideo = async (req, res) => {
    try {
        // Step 1: Extract video data from request body
        const { title, description, videoUrl, thumbnailUrl, category } = req.body;

         // Step 2: Validate required fields
        if (!title || !videoUrl || !category) {
            return res.status(400).json({ message: "Title, videoUrl and category are required" });
        }

         // Step 3: Ensure the user has a channel before uploading a video
        if (!req.user.channel) {
            return res.status(400).json({ message: "Create a channel first" });
        }

        // Step 4: Create a new video document
        const newVideo = await Video.create({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            category,
            channel: req.user.channel,
            uploader: req.user._id,
        });

         // Step 5: Add the new video ID to the channel's videos array
        await Channel.findByIdAndUpdate(req.user.channel, {
            $push: { videos: newVideo._id },
        });

         // Step 6: Send success response
        res.status(201).json({
            message: "Video uploaded successfully",
            video: newVideo,
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: error.message });
    }
};

// 2. Get All Videos
export const getAllVideos = async (req, res) => {
    try {
        // Extract search and category filters from query parameters
        const { search, category } = req.query;

        // Create a query object for filtering
        let query = {};

        // If search keyword exists, filter videos by title (case-insensitive)
        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        // If category is provided, filter videos by category
        if (category) {
            query.category = category;
        }

        // Fetch videos from database with channel and uploader details
        const videos = await Video.find(query)
            .populate("channel", "channelName")
            .populate("uploader", "username avatar")
            .sort({ createdAt: -1 });

        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get Video By Id
export const getVideoById = async (req, res) => {
    try {
        // Extract video ID from request parameters
        const { id } = req.params;

        // Find the video and populate related channel and uploader details
        const video = await Video.findById(id)
            .populate("channel", "channelName subscribers")
            .populate("uploader", "username avatar");

            // If video does not exist
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Increment the view count each time the video is fetched
        await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });

        // Send video data
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Update Video
export const updateVideo = async (req, res) => {
    try {
         // Extract video ID
        const { id } = req.params;

         // Find the video
        const video = await Video.findById(id);

        // Check if video exists
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Ensure that only the uploader can update the video
        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Extract updated fields
        const { title, description, thumbnailUrl, category } = req.body;

        // Update video details
        const updatedVideo = await Video.findByIdAndUpdate(
            id,
            { title, description, thumbnailUrl, category },
            { new: true }
        );

        res.status(200).json({
            message: "Video updated successfully",
            video: updatedVideo,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Delete Video
export const deleteVideo = async (req, res) => {
    try {
        // Extract video ID
        const { id } = req.params;

        
        const video = await Video.findById(id);

         // Check if video exists
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        // Ensure only the uploader can delete the video
        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Delete the video document
        await Video.findByIdAndDelete(id);

        // Remove the video reference from the channel's videos array
        await Channel.findByIdAndUpdate(video.channel, {
            $pull: { videos: id },
        });

        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Like Video
export const likeVideo = async (req, res) => {
    try {
        // Extract video ID and user ID
        const { id } = req.params;
        
        const userId = req.user._id;
        // Find the video
        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        let message = "Video liked";

        // If user already liked the video → remove like
        if (video.likes.includes(userId)) {
            await Video.findByIdAndUpdate(id, { $pull: { likes: userId } });
            message = "Like removed";
        } else {
            // If user previously disliked → remove dislike
            await Video.findByIdAndUpdate(id, { $pull: { dislikes: userId } });

            // Add like
            await Video.findByIdAndUpdate(id, { $push: { likes: userId } });

            message = "Video liked";
        }

        // Fetch updated video data
        const updatedVideo = await Video.findById(id);

        res.status(200).json({
            message,
            likes: updatedVideo.likes.length,
            dislikes: updatedVideo.dislikes.length,
            likesList: updatedVideo.likes,
            dislikesList: updatedVideo.dislikes,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 7. Dislike Video
export const dislikeVideo = async (req, res) => {
    try {
        // Extract video ID and user ID
        const { id } = req.params;
        const userId = req.user._id;

        // Find the video
        const video = await Video.findById(id);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        let message = "Video disliked";

        // If user already disliked → remove dislike
        if (video.dislikes.includes(userId)) {
            await Video.findByIdAndUpdate(id, { $pull: { dislikes: userId } });
            message = "Dislike removed";
        } else {
            // If user previously liked → remove like
            await Video.findByIdAndUpdate(id, { $pull: { likes: userId } });

            // Add dislike
            await Video.findByIdAndUpdate(id, { $push: { dislikes: userId } });

            message = "Video disliked";
        }

        // Fetch updated video data
        const updatedVideo = await Video.findById(id);

        res.status(200).json({
            message,
            likes: updatedVideo.likes.length,
            dislikes: updatedVideo.dislikes.length,
            likesList: updatedVideo.likes,
            dislikesList: updatedVideo.dislikes,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
