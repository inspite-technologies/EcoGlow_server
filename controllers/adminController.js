import Admin from "../models/adminSchema.js";
import generateToken from "../utils/generateToken.js";

const adminSignup = async (req, res) => {
  try {
    // 1. Singleton Check: Prevent multiple admin accounts
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Admin account already exists. Use Login.",
        });
    }
    const { email, password } = req.body;

    // 2. Create and Save Admin
    const newAdmin = new Admin({ email, password });
    await newAdmin.save();
    res
      .status(201)
      .json({ success: true, message: "Admin account created successfully" });
  } catch (error) {
    console.error("Admin Signup Error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create Admin account",
        error: error.message,
      });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please provide email and password",
      });
    }

    const existAdmin = await Admin.findOne({
      email,
    });

    if (!existAdmin) {
      return res.status(404).json({
        success: false,
        msg: "Admin not found",
      });
    }

    const isMatch = await existAdmin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Incorrect password",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Admin login successful",
      token: generateToken(existAdmin._id),
      admin: {
        id: existAdmin._id,
        userName: existAdmin.userName,
        email: existAdmin.email,
      },
    });
  } catch (err) {
    console.error("Admin Login Error:", err.message);
    res.status(500).json({
      success: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};

export { adminSignup, adminLogin };
