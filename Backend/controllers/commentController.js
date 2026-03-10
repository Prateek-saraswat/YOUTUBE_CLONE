import Comment from '../models/Comment.js'
import Video from '../models/Video.js'

// 1. Add Comment
export const addComment = async (req, res) => {
    try {
        const { id } = req.params  // videoId
        const { text } = req.body

        // validation
        if (!text) {
            return res.status(400).json({ message: "Comment text is required" })
        }

        // video exists check
        const video = await Video.findById(id)
        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        // comment banao
        const newComment = await Comment.create({
            text,
            user: req.user._id,
            video: id
        })

        res.status(201).json({
            message: "Comment added successfully",
            comment: newComment
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// 2. Get Comments
export const getComments = async (req, res) => {
    try {
        const { id } = req.params  // videoId

        const comments = await Comment.find({ video: id })
            .populate('user', 'username avatar')
            .sort({ createdAt: -1 })  // latest pehle

        res.status(200).json(comments)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// 3. Update Comment
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params  // commentId
        const { text } = req.body

        // validation
        if (!text) {
            return res.status(400).json({ message: "Comment text is required" })
        }

        // comment find karo
        const comment = await Comment.findById(id)

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }

        // owner check karo
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" })
        }

        // update karo
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { text },
            { new: true }
        )

        res.status(200).json({
            message: "Comment updated successfully",
            comment: updatedComment
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// 4. Delete Comment
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params  // commentId

        // comment find karo
        const comment = await Comment.findById(id)

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" })
        }

        // owner check karo
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" })
        }

        await Comment.findByIdAndDelete(id)

        res.status(200).json({ message: "Comment deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
