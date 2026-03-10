import express from 'express'
import { addComment, getComments, updateComment, deleteComment } from '../controllers/commentController.js'
import protect from '../middlewares/authMiddleware.js'

const commentRouter = express.Router()

commentRouter.post('/:videoId', protect, addComment)      // add comment
commentRouter.get('/:videoId', getComments)               // get comments
commentRouter.put('/:id', protect, updateComment)         // update comment
commentRouter.delete('/:id', protect, deleteComment)      // delete comment

export default commentRouter
