import jwt from "jsonwebtoken";
import User from '../models/User.js'

 const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token , access denied" });
    }

    if (!authHeader.startsWith("JWT ") && !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decode.id).select('-password')
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


export default protect