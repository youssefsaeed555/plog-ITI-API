const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "please input your user name"],
  },
  email: {
    type: String,
    unique: [true, "email must ne unique"],
    required: [true, "please input your email"],
    trim: true,
  },
  password: {
    type: String,
    minLength: [8, "too short password"],
  },
  profileImg: String,
  profileImgId: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  wishlist: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Posts",
    },
  ],
  changePasswordAt: Date,
  passwordCodeReset: String,
  passwordCodeResetExpire: Date,
  isVerified: { type: Boolean, default: false },
});

userSchema.pre(/^find/, function (next) {
  this.populate("wishlist");
  next();
});

module.exports = mongoose.model("Users", userSchema);
