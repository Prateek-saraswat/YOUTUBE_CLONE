

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

export const getAllVideos = async (req, res) => {
    try {
        const { search, category } = req.query

        // query object banao
        let query = {}

        // search by title
        if (search) {
            query.title = { $regex: search, $options: 'i' }  // case insensitive
        }

        // filter by category
        if (category) {
            query.category = category
        }

        const videos = await Video.find(query)
            .populate('channel', 'channelName')
            .populate('uploader', 'username avatar')
            .sort({ createdAt: -1 })  // latest pehle

        res.status(200).json(videos)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// 3. Get Video By Id
export const getVideoById = async (req, res) => {
    try {
        const { id } = req.params

        const video = await Video.findById(id)
            .populate('channel', 'channelName')
            .populate('uploader', 'username avatar')

        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        // views increment karo
        await Video.findByIdAndUpdate(id, { $inc: { views: 1 } })

        res.status(200).json(video)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateVideo = async (req, res) => {
    try {
        const { id } = req.params

        const video = await Video.findById(id)

        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        // owner check karo
        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" })
        }

        const { title, description, thumbnailUrl, category } = req.body

        const updatedVideo = await Video.findByIdAndUpdate(
            id,
            { title, description, thumbnailUrl, category },
            { new: true }
        )

        res.status(200).json({
            message: "Video updated successfully",
            video: updatedVideo
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


// 5. Delete Video
export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params

        const video = await Video.findById(id)

        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        // owner check karo
        if (video.uploader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" })
        }

        await Video.findByIdAndDelete(id)

        // channel ke videos array se remove karo
        await Channel.findByIdAndUpdate(video.channel, {
            $pull: { videos: id }
        })

        res.status(200).json({ message: "Video deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}