import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    passwordChangedAt: {
    type: Date,
    default: null,
    select: false,
},

    // User Role
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },

  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
