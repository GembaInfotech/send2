const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const { Schema } = mongoose;

const guardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  aadhar: {
    type: String,
  },
  parking: {
    type: String,
  },
  contact: {
    type: Number,
  },
  image: String,
  active: {
    type: Boolean,
    default: true,
  },
});

guardSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

guardSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

guardSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model("GuardModel", guardSchema);
