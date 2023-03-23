const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minLength: [8, "too short title"],
    },
    content: {
      type: String,
      required: [true, "content is required"],
    },
    photo: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: [true, "post should belongs to user"],
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
postSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "-password" });
  next();
});

module.exports = mongoose.model("Posts", postSchema);
