import User from '../models/User.js'
import Channel from '../models/Channel'

export const createChannel = async (req , res)=> {

    const user  = req.user
    const {channelName ,  description , channelBanner } = req.body

    if(!channelName || !description || !channelBanner ){
        return 
    }

    const uniqueChannel = await Channel.findOne({channelName})

    if(uniqueChannel){
        return res.status(400).json({ message: "Channel name already taken" });
    }



}