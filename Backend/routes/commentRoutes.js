import express from 'express'
import { addComment, getComments, updateComment, deleteComment } from '../controllers/commentController.js'
import protect from '../middlewares/authMiddleware.js'

const commentRouter = express.Router()

// video ke comments
commentRouter.post('/:id/comments', protect, addComment)
commentRouter.get('/:id/comments', getComments)

// single comment
commentRouter.put('/comments/:id', protect, updateComment)
commentRouter.delete('/comments/:id', protect, deleteComment)

export default commentRouter