const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    userId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  resetToken: String,
  resetTokenExpiry: Date
  },
  { timestamp: true }
);

const Users = mongoose.model("users", userSchema);

module.exports = Users;
