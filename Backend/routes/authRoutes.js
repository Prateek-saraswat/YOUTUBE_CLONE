import express from "express"
import { login , register } from "../controllers/authController.js"

// Create an Express router instance
const authRouter = express.Router()

// Route for user login
// This endpoint handles authentication of existing users
// Example: POST /api/auth/login
authRouter.post('/login' , login)


// Route for user registration
// This endpoint creates a new user account
// Example: POST /api/auth/register
authRouter.post('/register' , register)

// Export the router to use in the main server file
export default authRouter;
