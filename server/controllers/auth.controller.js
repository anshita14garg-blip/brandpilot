import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";

const shape = (u) => ({ _id: u._id, name: u.name, email: u.email, brand: u.brand });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }
  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error("Email already registered");
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, user: shape(user), token: generateToken(user._id) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  res.json({ success: true, user: shape(user), token: generateToken(user._id) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: shape(req.user) });
});

export const updateBrand = asyncHandler(async (req, res) => {
  req.user.brand = { ...req.user.brand.toObject?.() ?? req.user.brand, ...req.body };
  await req.user.save();
  res.json({ success: true, user: shape(req.user) });
});
