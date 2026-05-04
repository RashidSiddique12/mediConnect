const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: [true, "Hospital is required"],
    },
    name: {
      type: String,
      required: [true, "Doctor name is required"],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    specialtyIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Specialty",
      },
    ],
    experience: {
      type: Number,
      default: 0,
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    qualification: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    licenseNumber: {
      type: String,
      trim: true,
    },
    registrationCouncil: {
      type: String,
      trim: true,
    },
    registrationYear: {
      type: Number,
    },
    languages: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    consultationTypes: {
      type: [String],
      enum: ["in_person", "video", "phone"],
      default: ["in_person"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true },
);

// Auto-generate slug from name before saving
doctorSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    const base = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    this.slug = `${base}-${this._id.toString().slice(-6)}`;
  }
  next();
});

module.exports = mongoose.model("Doctor", doctorSchema);
