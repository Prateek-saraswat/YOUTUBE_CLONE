import mongoose from "mongoose"

// Define schema for Channel collection
const channelSchema = new mongoose.Schema({
     // Name of the channel
    channelName:{
        type:String,
        trim:true,
        required:[true , "Channel name is required"],
        unique:true

    },
    // Reference to the user who owns the channel
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true

    },
    // Channel description (about section)
    description:{
        type:String,
        default: ""

    },
    // URL of channel banner image
    channelBanner:{
        type:String,
        default:""

    },
    // Number of subscribers for the channel
    subscribers:{
        type:Number,
        default:0
    },
    // List of videos uploaded by this channel
    videos:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Video"
        }
    ]

} , {timestamps : true})
// timestamps automatically add createdAt and updatedAt fields

// Create Channel model using the schema
const Channel = mongoose.model("Channel" , channelSchema)

export default Channel