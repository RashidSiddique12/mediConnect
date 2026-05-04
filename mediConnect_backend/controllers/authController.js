const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const {
  generateTokens,
  generateAccessToken,
} = require("../utils/generateToken");
const { success, created } = require("../utils/apiResponse");

// POST /api/v1/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "patient",
    });

    const tokens = await generateTokens(user._id);

    created(
      res,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        ...tokens,
      },
      "Registration successful",
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    if (user.status === "inactive") {
      return res
        .status(403)
        .json({ success: false, message: "Account is deactivated." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }

    const tokens = await generateTokens(user._id);

    success(
      res,
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          dob: user.dob,
          gender: user.gender,
          address: user.address,
          bloodGroup: user.bloodGroup,
          allergies: user.allergies,
          emergencyContact: user.emergencyContact,
        },
        ...tokens,
      },
      "Login successful",
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token." });
    }

    if (storedToken.expiresAt < new Date()) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      return res
        .status(401)
        .json({ success: false, message: "Refresh token expired." });
    }

    const accessToken = generateAccessToken(storedToken.userId);

    success(res, { accessToken }, "Token refreshed");
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/auth/logout
const logout = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    success(res, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "phone",
      "dob",
      "gender",
      "address",
      "bloodGroup",
      "allergies",
      "emergencyContact",
    ];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    success(
      res,
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender,
        address: user.address,
        bloodGroup: user.bloodGroup,
        allergies: user.allergies,
        emergencyContact: user.emergencyContact,
      },
      "Profile updated successfully",
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, logout, updateProfile };
