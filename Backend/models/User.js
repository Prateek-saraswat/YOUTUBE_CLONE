import mongoose from "mongoose";


// Define schema for User collection
const UserSchema = new mongoose.Schema(
  {
      // Username of the user
    username: {
      type: String,
      required: true,
    },
    // Email address used for login and identification
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // User password (will usually be stored as hashed password)
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
     // Profile avatar URL
    avatar: {
      type: String,
      required: false,
      default: function () { 
        return `https://ui-avatars.com/api/?name=${this.username}`;
      },
    },
    // Reference to the channel created by the user
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      default: null,
    },
  },
  { timestamps: true },
);
// Automatically adds createdAt and updatedAt fields


// Create User model using the schema
const User = mongoose.model("User", UserSchema);

export default User;
