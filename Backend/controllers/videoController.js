

export const uploadVideo = async (req, res) => {
    try {
        // Step 1 — data lo
        const { title, description, videoUrl, thumbnailUrl, category } = req.body

        // Step 2 — validation
        if (!title || !videoUrl || !category) {
            return res.status(400).json({ message: "Title, videoUrl and category are required" })
        }

        // Step 3 — user ka channel check karo
        if (!req.user.channel) {
            return res.status(400).json({ message: "Create a channel first" })
        }

        // Step 4 — video banao
        const newVideo = await Video.create({
            title,
            description,
            videoUrl,
            thumbnailUrl,
            category,
            channel: req.user.channel,
            uploader: req.user._id
        })

        // Step 5 — channel ke videos array mein push karo
        await Channel.findByIdAndUpdate(req.user.channel, {
            $push: { videos: newVideo._id }
        })

        // Step 6 — response bhejo
        res.status(201).json({
            message: "Video uploaded successfully",
            video: newVideo
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}