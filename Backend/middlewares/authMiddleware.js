import jwt from "jsonwebtoken";
import User from '../models/User.js'

// Authentication middleware to protect private routes
 const protect = async (req, res, next) => {
  try {
    // Get authorization header from request
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return res.status(401).json({ message: "No token , access denied" });
    }

    // Ensure the token format is correct (JWT or Bearer)
    if (!authHeader.startsWith("JWT ") && !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Extract token from header (format: Bearer TOKEN)
    const token = authHeader.split(" ")[1];

     // Verify the token using secret key
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

     // Find the user from database using decoded token id
        const user = await User.findById(decode.id).select('-password')
        // Attach user data to request object so it can be used in next middleware/controllers
        req.user = user;

        // Continue to the next middleware or route handler
      next();
  } catch (error) {
    // If token verification fails, return unauthorized error
    return res.status(401).json({ message: "Invalid token" });
  }
};


export default protect