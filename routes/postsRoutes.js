const express = require("express");

const routes = express.Router({ mergeParams: true });

const {
  createPost,
  updatePhoto,
  updatePost,
  getAllPosts,
  getLoggedUserPosts,
  getPost,
  deletePost,
} = require("../services/postsServices");

const {
  getPostValidator,
  createPostValidator,
  updatePostValidator,
  deletePostValidator,
} = require("../utils/validators/postValidator");

const { protect } = require("../services/authServices");

const upload = require("../middleware/upload_images");

routes.use(protect);

routes
  .route("/")
  .get(getAllPosts)
  .post(upload.uploadSingle("photo"), createPostValidator, createPost);

routes.get("/getMyPosts", getLoggedUserPosts);

routes
  .route("/:id")
  .get(getPostValidator, getPost)
  .put(upload.uploadSingle("photo"), updatePostValidator, protect, updatePost)
  .delete(deletePostValidator, protect, deletePost);

routes
  .route("/updatePhoto/:id")
  .put(protect, upload.uploadSingle("photo"), updatePhoto);

module.exports = routes;
