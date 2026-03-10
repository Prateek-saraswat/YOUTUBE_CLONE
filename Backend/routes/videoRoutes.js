import express from "express"
import protect from "../middlewares/authMiddleware.js"
import { deleteVideo, dislikeVideo, getAllVideos, getVideoById, likeVideo, updateVideo, uploadVideo } from "../controllers/videoController.js"

const videoRouter = express.Router()


videoRouter.post('/', protect, uploadVideo)
videoRouter.get('/', getAllVideos)
videoRouter.get('/:id', getVideoById)
videoRouter.put('/:id', protect, updateVideo)
videoRouter.delete('/:id', protect, deleteVideo)
videoRouter.put('/:id/like', protect, likeVideo)
videoRouter.put('/:id/dislike', protect, dislikeVideo)

export default videoRouter;