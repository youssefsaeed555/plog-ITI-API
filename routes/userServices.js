const express = require("express");

const routes = express.Router();

const {
  changePassword,
  updatePhoto,
  getLoggedUser,
  updateLoggedUser,
  deleteUser,
} = require("../services/userServices");
const { protect } = require("../services/authServices");
const { uploadSingle } = require("../middleware/upload_images");
const {
  changePasswordValidator,
  validateUpdateLoggedUser,
} = require("../utils/validators/userValidator");

routes
  .route("/changePassword")
  .post(protect, changePasswordValidator, changePassword);

routes
  .route("/updatePhoto")
  .put(protect, uploadSingle("profileImg"), updatePhoto);

routes.route("/getMe").get(protect, getLoggedUser);

routes
  .route("/updateMe")
  .put(protect, validateUpdateLoggedUser, updateLoggedUser);

routes.route("/").delete(protect, deleteUser);

module.exports = routes;
