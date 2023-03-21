const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/express_validator");
const Post = require("../../models/posts");

exports.createPostValidator = [
  check("title")
    .notEmpty()
    .withMessage("title of post is required")
    .isLength({ min: 8 })
    .withMessage("Too short post title"),
  check("content")
    .notEmpty()
    .withMessage("title of post is required")
    .isLength({ max: 100 }),
  validatorMiddleware,
];

exports.getPostValidator = [
  check("id").isMongoId().withMessage("Invalid ID Format"),
  validatorMiddleware,
];

exports.updatePostValidator = [
  check("id").custom(async (val, { req }) => {
    const post = await Post.findById(val);
    if (!post) {
      throw new Error("post not found");
    }
    if (post.user._id.toString() !== req.user._id.toString()) {
      throw new Error("you not allowed to modify this post");
    }
    return true;
  }),
  validatorMiddleware,
];

exports.deletePostValidator = [
  check("id").custom(async (val, { req }) => {
    const post = await Post.findById(val);
    if (!post) {
      throw new Error("post not found");
    }
    if (post.user._id.toString() !== req.user._id.toString()) {
      throw new Error("you not allowed to delete this post");
    }
    return true;
  }),
  validatorMiddleware,
];
