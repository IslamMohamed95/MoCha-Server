const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  category: {
    type: String,
  },
  priority: {
    type: String,
  },
  comments: [
    { comment: { type: String, default: "" }, userId: { type: String } },
  ],
  description: {
    type: String,
    trim: true,
    minlength: 1,
  },
  pictures: [{ picture: { type: String, default: "" } }],
});

const Post = mongoose.model("Posts", postSchema);
module.exports = Post;
