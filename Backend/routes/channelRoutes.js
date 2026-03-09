import express from "express"
import { createChannel, deleteChannelById, getChannelById, updateChannelById } from "../controllers/channelController.js"
import protect from "../middlewares/authMiddleware.js"

const channelRoute = express.Router()



channelRoute.post('/' , protect , createChannel )

channelRoute.get('/:id' , getChannelById)

channelRoute.put('/:id' , protect, updateChannelById)

channelRoute.delete('/:id' , protect, deleteChannelById)

export default channelRoute;