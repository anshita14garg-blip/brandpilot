import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User no longer exists");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    next(err);
  }
}
