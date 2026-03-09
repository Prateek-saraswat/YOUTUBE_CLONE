import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import cors from "cors"


const MONGO_URI = process.env.MONGO_URI;
const app = express();
app.use(express.json())
app.use(cors())

connectDB(MONGO_URI);

app.use('/api/auth' , authRouter)

app.get("/", (req, res) => {
  return res.status(200).json({ success: true, status: "Active : healthy" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
