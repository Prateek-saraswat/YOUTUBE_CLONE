import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { username, email, password , avatar} = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar
    });

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;

    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRE_TIME,
    });

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
