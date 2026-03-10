import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import User from "../models/User.js";


//  POST /api/auth/register
//  Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password , avatar} = req.body;

     // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "email already registered" });
    }

    // Hash password before saving — salt rounds: 10
    const hashedPassword = await bcrypt.hash(password, 10);

     // Create and save new user to database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar
    });

    // Return success — never send password back in response
    res.status(201).json({
      message: "user registered sucessfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// POST /api/auth/login
// Authenticate user and return JWT token

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
     // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists with given email
    const user = await User.findOne({ email });

    if (!user) {
      // Keep error message vague — don't reveal whether email exists
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare submitted password against stored hashed password
    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Read JWT config from environment variables
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;

    // Sign JWT — payload contains only user id to keep token small
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRE_TIME,
    });

    // Return token +  user data 
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        avatar:user.avatar,
        channel: user.channel,

      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
