//requires
const auth = require("./authServices");
const userServices = require("./userServices");
const wishlistRoutes = require("./wishlistRoutes");
const postsRoutes = require("./postsRoutes");

const mountRoutes = (app) => {
  //mounting routes
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/user", userServices);
  app.use("/api/v1/wishlist", wishlistRoutes);
  app.use("/api/v1/posts", postsRoutes);
};

module.exports = mountRoutes;
