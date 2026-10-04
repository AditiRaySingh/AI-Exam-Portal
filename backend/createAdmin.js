import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import userModel from "./models/userModel.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@gla.ac.in";
    const adminPassword = "ChangeThisAdminPassword123";

    const existingAdmin = await userModel.findOne({
      email: adminEmail
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    await userModel.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin created successfully.");
    console.log("Email:", adminEmail);

    process.exit(0);

  } catch (error) {
    console.error("ADMIN CREATION ERROR:", error);
    process.exit(1);
  }
};

createAdmin();