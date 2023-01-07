const postModel = require("../models/posts.model");
const { ObjectId } = require("mongodb");

class Post {
  //Option only for (Users) to add new post
  static addPost = async (req, res) => {
    try {
      const newPost = await new postModel({
        ...req.body,
        userID: req.user._id,
      });
      await newPost.save();
      res.status(200).send({
        APIstatus: true,
        userPost: newPost,
        message: "Post added successfully!",
      });
    } catch (e) {
      res.status(500).send({ APIstatus: false, message: e.message });
    }
  };

  //Comments
  static addComment = async (req, res) => {
    try {
      const comment = await postModel.findByIdAndUpdate(req.params.id, {
        $push: {
          comments: {
            comment: req.body.comment,
            userId: req.user._id,
          },
        },
      });
      await comment.save();
      res.status(200).send({
        APIstatus: true,
        message: "comment Added Successfully",
        commentDis: comment,
      });
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };

  //Option only for (Users) to show his own posts
  static showUserPosts = async (req, res) => {
    try {
      await req.user.populate({
        path: "userPosts",
        // option:[]
      });
      res.status(200).send({
        APIstatus: true,
        data: req.user.userPosts,
        message: "Post successfully!",
      });
    } catch (e) {
      res.status(500).send({ APIstatus: false, message: e.message });
    }
  };

  //Option for only (Users) to delete "one" of his posts
  static deletePost = async (req, res) => {
    try {
      const targetPost = await postModel.findByIdAndDelete(req.params.id);
      if (!targetPost) throw new Error("Can't find post to delete...!");
      res.status(200).send({
        APIstatus: true,
        message: "Post Deleted Successfully",
        data: targetPost,
      });
    } catch (e) {
      res.send({
        APIstatus: false,
        message: e.message,
      });
    }
  };

  //Option for only (Users) to delete all of his posts
  static deleteAllPosts = async (req, res) => {
    try {
      await postModel.deleteMany();
      res.status(200).send({
        APIstatus: true,
        message: "Deleted successfully",
      });
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };

  //Option for only (Users) to edit his post
  static editPost = async (req, res) => {
    try {
      const targetPost = await postModel.findByIdAndUpdate(req.params.id, {
        $set: {
          description: req.body.post,
        },
      });
      await targetPost.save();
      res.status(200).send({
        APIstatus: true,
        message: "Post updated Successfully",
      });
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };

  //Get target post
  static targetPost = async (req, res) => {
    try {
      const targetPost = await postModel.findById(new ObjectId(req.params.id));
      await targetPost.save();
      res.status(200).send({
        APIstatus: true,
        activePost: targetPost,
      });
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };

  //Get userPage posts
  static userPagePost = async (req, res) => {
    try {
      const posts = [];
      const allPosts = await postModel.find({});
      allPosts.forEach((post) => {
        if (post.userID == req.params.id) {
          posts.push(post);
        }
      });
      res.status(200).send({
        APIstatus: true,
        userPagePosts: posts,
      });
    } catch (e) {
      res.status(500).send({
        APIstatus: false,
        message: e.message,
      });
    }
  };
}

module.exports = Post;
