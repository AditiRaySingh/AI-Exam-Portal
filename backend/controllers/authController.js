import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// register
export const userregistration = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const userExist = await userModel.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  console.log("BODY RECEIVED:", req.body);
  
    res.status(201).json({
      message: "User registered successfully",
      user: userData
    });
   

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

// login
export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};