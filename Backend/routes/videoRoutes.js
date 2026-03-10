import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { deleteVideo, dislikeVideo, getAllVideos, getVideoById, likeVideo, updateVideo, uploadVideo } from "../controllers/videoController.js"

// Create an Express router instance for video-related routes
const videoRouter = express.Router()


// Upload a new video
videoRouter.post('/', protect, uploadVideo)
// Get all videos
videoRouter.get('/', getAllVideos)

// Get a single video by ID
videoRouter.get('/:id', getVideoById)

// Update video details
videoRouter.put('/:id', protect, updateVideo)
// Delete a video
videoRouter.delete('/:id', protect, deleteVideo)
// Like a video
videoRouter.put('/:id/like', protect, likeVideo)
// Dislike a video
videoRouter.put('/:id/dislike', protect, dislikeVideo)

// Export the router to use in the main server file
export default videoRouter;