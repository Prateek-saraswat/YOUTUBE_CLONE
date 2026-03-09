import mongoose from "mongoose";



const connectDB = async (MONGO_URI) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Mongo db connection successful");
  } catch (error) {
    console.log("Mongodb connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
