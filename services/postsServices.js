const asyncHandler = require("express-async-handler");
const fs = require("fs/promises");
const ApiError = require("../utils/ApiError");
const cloud = require("../utils/cloudinary");
const Posts = require("../models/posts");

exports.createPost = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(`image of post is required  `, 400));
  }
  const result = await cloud.uploads(req.file.path, "posts");
  req.body.photo = result.url;
  const post = await Posts.create({ ...req.body, user: req.user._id });
  res.status(201).json({ data: post });
});

exports.getAllPosts = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const posts = await Posts.find().skip(skip).limit(limit);
  if (posts.length === 0) {
    return next(new ApiError("oops no posts found", 200));
  }
  res.status(200).json({
    result: posts.length,
    page,
    data: posts,
  });
});

exports.getPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Posts.findById(id);
  if (!post) {
    return next(new ApiError(`No post for this id ${id} `, 404));
  }
  res.status(200).json({ data: post });
});

exports.getLoggedUserPosts = asyncHandler(async (req, res, next) => {
  const userPosts = await Posts.find({ user: req.user._id });
  if (userPosts.length === 0) {
    return next(new ApiError(`no posts for this user`, 200));
  }
  return res.status(200).json({ numOfPosts: userPosts.length, userPosts });
});

exports.updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Posts.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!post) {
    return next(new ApiError(`No post for this id ${id} `, 404));
  }
  res.status(200).json({ data: post });
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await Posts.findByIdAndDelete(id);
  if (!post) {
    return next(new ApiError(`No post for this id ${id} `, 404));
  }
  res.status(204).send();
});

exports.updatePhoto = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await Posts.findById(id);
  if (!post) {
    return next(new ApiError("this post not found", 400));
  }
  if (!req.file) {
    return next(new ApiError("you must upload photo", 400));
  }
  const result = await cloud.uploads(req.file.path, "posts");

  post.photo = result.url;

  await post.save();
  await fs.unlink(req.file.path);

  return res
    .status(200)
    .json({ message: "photo update successfully", photo: result.url });
});
