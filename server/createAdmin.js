// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.DB_URI || "your_fallback_uri_here"; // fallback only for testing

// Define user schema minimally (if you already have User model in /model, you can import it instead)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isApproved: Boolean,
  isVerify: Boolean,
  profile_pic: Object,
}, { collection: "users" });

const User = mongoose.model("user", userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(uri);
    const existing = await User.findOne({ email: "admin@example.com" });
    if (existing) {
      console.log("⚠️ Admin already exists. Skipping creation.");
    } else {
      const hashedPassword = await bcrypt.hash("adminpass", 10);
      const newAdmin = await User.create({
        name: "Super Admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        isApproved: true,
        isVerify: true,
        profile_pic: {
          url: "https://res.cloudinary.com/dab0ekhmy/image/upload/v1728130610/thik-ai/gvjpvq3xljmnw2vwdkag.avif",
          public_id: null,
        },
      });
      console.log("✅ Admin created:", newAdmin);
    }
  } catch (err) {
    console.error("❌ Failed to create admin:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
