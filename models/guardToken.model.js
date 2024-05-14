const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  guard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GuardModel",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 6 * 60 * 60, // 6 hours
  },
});

module.exports = mongoose.model("GuardToken", tokenSchema);
