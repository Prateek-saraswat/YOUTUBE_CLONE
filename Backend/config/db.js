import mongoose from "mongoose";


// Connects to MongoDB using the provided URI.
const connectDB = async (MONGO_URI) => {
  try {
    // Attempt to establish a connection to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Mongo db connection successful");
  } catch (error) {
    // Log the error and exit the process if connection fails
    // process.exit(1) = exit with failure code (stops the server)
    console.log("Mongodb connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
