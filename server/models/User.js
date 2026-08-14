import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const brandSchema = new mongoose.Schema({
  name: { type: String, default: "My Brand" },
  industry: { type: String, default: "General" },
  tone: { type: String, default: "Friendly" },       // Friendly | Bold | Professional | Witty
  audience: { type: String, default: "Gen Z" },
  keywords: { type: [String], default: [] },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  brand: { type: brandSchema, default: () => ({}) },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
