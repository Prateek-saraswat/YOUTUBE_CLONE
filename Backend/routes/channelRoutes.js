import express from "express"
import { createChannel, deleteChannelById, getChannelById, updateChannelById } from "../controllers/channelController.js"
import protect from "../middlewares/authMiddleware.js"

// Create an Express router instance for channel-related routes
const channelRoute = express.Router()


// Create a new channel
channelRoute.post('/' , protect , createChannel )

// Get channel details by channel ID
channelRoute.get('/:id' , getChannelById)

// Update channel details
channelRoute.put('/:id' , protect, updateChannelById)

// Delete a channel
channelRoute.delete('/:id' , protect, deleteChannelById)

// Export router to use in main server file
export default channelRoute;