import mongoose from "mongoose"

const channelSchema = new mongoose.Schema({
    channelName:{
        type:String,
        trim:true,
        required:[true , "Channel name is required"],
        unique:true

    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true

    },
    description:{
        type:String,
        default: ""

    },
    channelBanner:{

        type:String,
        default:""

    },
    subscribers:{
        type:Number,
        default:0
    },
    videos:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Video"
        }
    ]

} , {timestamps : true})

const Channel = mongoose.model("Channel" , channelSchema)

export default Channel