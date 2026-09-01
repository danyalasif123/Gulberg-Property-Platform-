import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await Admin.findOne({
      email: "admin@gulberg.com"
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    await Admin.create({
      name: "Gulberg Admin",
      email: "admin@gulberg.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin created successfully");
    console.log("Email: admin@gulberg.com");
    console.log("Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();