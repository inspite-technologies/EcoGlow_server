import AsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Admin from "../../models/adminSchema.js";

const protectAdmin = AsyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log("Token received in middleware:", token ? "Token present" : "Token missing");
    if (token) {
      console.log("Token preview (first 10):", token.substring(0, 10));
    }
    console.log("JWT_SECRET_KEY used for verification (first 3):", process.env.JWT_SECRET_KEY?.substring(0, 3));
    console.log("JWT_SECRET_KEY length:", process.env.JWT_SECRET_KEY?.length);

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const org = await Admin.findById(decoded.id);

    if (!org) {
      return res.status(401).json({ msg: "Admin not found" });
    }

    req.admin = org;
    next();
  } catch (error) {
    console.error("Organization auth error:", error);
    res.status(401).json({ msg: "Not authorized, invalid token" });
  }
});

export default protectAdmin;
