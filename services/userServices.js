const fs = require("fs/promises");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/users");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");
const cloud = require("../utils/cloudinary");
const Post = require("../models/posts");

exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    { new: true }
  );

  //generate token
  const token = generateToken(user._id);
  return res.status(200).json({ message: "update successfully", token });
});

exports.updatePhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError("you must upload photo", 400));
  }
  const result = await cloud.uploads(req.file.path, "users");

  const user = await User.findById(req.user._id);

  user.profileImg = result.url;
  await user.save();
  await fs.unlink(req.file.path);

  return res
    .status(200)
    .json({ message: "photo update successfully", profileImg: result.url });
});

//desc Get logged user
exports.getLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return next(new ApiError(`this user not found `, 404));
  }
  res.status(200).json({ data: user });
});

//Delete logged user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findByIdAndDelete(req.user._id);
  if (!user) {
    return next(new ApiError(`There is no user to delete`, 404));
  }
  // Find all posts associated with the user and delete them
  await Post.deleteMany({ user: userId });
  res.status(204).send();
});

exports.updateLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...req.body,
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`There is no user to Update by this id`, 404));
  }
  res.status(200).json({
    data: user,
  });
});
