import User from "../models/User.js";
import Channel from "../models/Channel.js";

// Create a new channel
export const createChannel = async (req, res) => {
  try {
    // Extract channel details from request body
    const { channelName, description, channelBanner } = req.body;

     // Check if channel name is provided
    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    // Check if a channel with the same name already exists
    const uniqueChannel = await Channel.findOne({ channelName });

    if (uniqueChannel) {
      return res.status(400).json({ message: "Channel name already taken" });
    }

    // Find the logged-in user
    const user = await User.findById(req.user._id);

    // Ensure a user can create only one channel
    if (user.channel !== null) {
      return res.status(400).json({ message: "You already have a channel" });
    }

    // Create a new channel document
    const newChannel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user._id,
    });

    // Update the user document with the created channel ID
    await User.findByIdAndUpdate(req.user._id, {
      channel: newChannel._id,
    });

    // Send success response
    res.status(201).json({
      message: "Channel created successfully",
      channel: newChannel,
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: error.message });
  }
};

// Get channel details by channel ID
export const getChannelById = async (req, res) => {
    try {
      // Extract channel ID from request params
        const { id } = req.params

         // Find channel and populate related data
        const channel = await Channel.findById(id)
            .populate('videos')
            .populate('owner', 'username avatar')

            // If channel does not exist
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" })
        }

        // Send channel data
        res.status(200).json(channel)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Update channel details
export const updateChannelById = async (req , res)=> {

   try{
    // Extract channel ID
     const {id} = req.params

      // Find the channel
    const channel = await Channel.findById(id)

    // Check if channel exists
    if(!channel){
        return res.status(404).json({ message: "Channel not found" }) 
    }

    // Verify that the logged-in user is the channel owner
    if(channel.owner.toString() !== req.user._id.toString()){
        return res.status(403).json({message : "Not authorized"})
    }

    // Extract updated fields
    const { channelName, description, channelBanner } = req.body

    // Update the channel document
    const updatedChannel = await Channel.findByIdAndUpdate(
            id,
            { channelName, description, channelBanner },
            { new: true }
        )

        // Send response
        res.status(200).json({ message: "Channel updated", channel: updatedChannel })
   }catch(error){
    res.status(500).json({ message: error.message })
   }
}

// Delete channel by ID
export const deleteChannelById = async (req , res)=> {
   try{
    // Extract channel ID
     const {id} = req.params

     // Find the channel
    const channel = await Channel.findById(id)

    // Check if channel exists
    if(!channel){
         return res.status(404).json({ message: "Channel not found" }) 
    }

    // Verify ownership before deleting
    if(channel.owner.toString() !== req.user._id.toString()){
        return res.status(403).json({message : "Not authorized"})
    }

    // Delete the channel
     await Channel.findByIdAndDelete(id)

     // Remove channel reference from user document
    await User.findByIdAndUpdate(req.user._id , {channel : null})
    // Send success response
    res.status(200).json({ message: "Channel deleted successfully" })
   }catch(error){
    res.status(500).json({ message: error.message })
   }
}