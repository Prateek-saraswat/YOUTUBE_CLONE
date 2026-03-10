import express from "express";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import channelRoute from "./routes/channelRoutes.js";
import cors from "cors"
import videoRouter from "./routes/videoRoutes.js";
import commentRouter from "./routes/commentRoutes.js";

// Get MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;
// Create Express application
const app = express();
// Middleware to parse JSON request bodies
app.use(express.json())
// Enable Cross-Origin Resource Sharing (allows frontend apps to access this API)
app.use(cors())
// Connect to MongoDB database
connectDB(MONGO_URI);

// Authentication routes (login, register)
app.use('/api/auth' , authRouter)

// Channel management routes (create, update, delete, get channel)
app.use('/api/channels' , channelRoute)

// Video-related routes (upload, watch, like, dislike, delete)
app.use('/api/videos' , videoRouter)

// Comment-related routes (add, update, delete, get comments)
app.use('/api/comments', commentRouter)

// Health check route to verify if server is running
app.get("/", (req, res) => {
  return res.status(200).json({ success: true, status: "Active : healthy" });
});


// Define server port
const PORT = process.env.PORT || 3000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
