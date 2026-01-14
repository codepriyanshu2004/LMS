import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minlength: [5, "Name must be at least 5 characters"],
      maxlength: [50, "Name should be less than 50 characters"],
      lowercase: true,
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please fill valid email address"]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false
    },

    avatar: {
      public_id: {
        type: String
      },
      secure_url: {
        type: String
      }
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    },

    forgotPasswordToken: {
      type: String
    },

    forgotPasswordExpiry: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);




userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.generateJWTToken = async function () {
  return await jwt.sign(
    {
      id: this._id,
      email: this.email,
      subscription: this.subscription,
      role: this.role
    },
    process.env.JWT_SECRET,

    {
      expiresIn: process.env.JWT_EXPIRY
    }

  );
};

const User = model("User", userSchema);
export default User;
