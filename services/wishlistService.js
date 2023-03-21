const asyncHandler = require("express-async-handler");

const User = require("../models/users");

//Add product to wishlist
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      //$addToSet => add product ID to wishlist array if product ID is not exist , if it exist it will ignore it
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "The product added successfully to your wishlist",
    data: user.wishlist,
  });
});

//Remove product from wishlist
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      //$pull => remove product ID from wishlist array if product is exist , if it is not exist it will ignore it
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "The product removed successfully from you wishlist",
    data: user.wishlist,
  });
});

//Get Logged user wishlist
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "Success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
