const express = require("express");

const routes = express.Router();

const {
  signup,
  login,
  forgetPassword,
  verifyCode,
  resetPassword,
} = require("../services/authServices");

const {
  signupValidator,
  validateLogin,
} = require("../utils/validators/authValidator");

const upload = require("../middleware/upload_images");

routes
  .route("/signup")
  .post(upload.uploadSingle("profileImg"), signupValidator, signup);

routes.route("/login").post(validateLogin, login);

routes.route("/forgetPassword").post(forgetPassword);

routes.route("/verifyCode").post(verifyCode);

routes.route("/resetPassword").put(resetPassword);

module.exports = routes;
