import User from "../models/User.js";
import Channel from "../models/Channel.js";

export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    const uniqueChannel = await Channel.findOne({ channelName });

    if (uniqueChannel) {
      return res.status(400).json({ message: "Channel name already taken" });
    }

    const user = await User.findById(req.user._id);

    if (user.channel !== null) {
      return res.status(400).json({ message: "You already have a channel" });
    }

    const newChannel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, {
      channel: newChannel._id,
    });

    res.status(201).json({
      message: "Channel created successfully",
      channel: newChannel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
