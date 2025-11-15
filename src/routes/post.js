const express = require("express");
const Post = require("../models/post");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendNotification = require("../utils/sendNotification");


const postRouter = express.Router();

postRouter.post("/posts", userAuth, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const post = new Post({ userId: req.user._id, content, imageUrl });
    await post.save();
    res.json({ message: "Post created", data: post });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

postRouter.get("/posts/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedUser._id, status: "accepted" },
        { toUserId: loggedUser._id, status: "accepted" },
      ],
    });

    const connectionIds = connections.map((c) =>
      c.fromUserId.toString() === loggedUser._id.toString()
        ? c.toUserId
        : c.fromUserId
    );

    connectionIds.push(loggedUser._id);

    const posts = await Post.find({ userId: { $in: connectionIds } })
      .populate("userId", "firstName lastName photoUrl") // post owner
      .populate("comments.userId", "firstName lastName photoUrl") // 👈 populate commenter
      .sort({ createdAt: -1 });

    res.json({ data: posts });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

postRouter.post("/posts/:id/like", userAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new Error("Post not found");

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);

      // 🔔 Send notification to post owner
      if (post.userId.toString() !== req.user._id.toString()) {
        await sendNotification(
          post.userId,
          req.user._id,
          "liked",
          `${req.user.firstName} liked your post`
        );
      }
    }

    await post.save();
    res.json({ message: "Post liked/unliked", data: post });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

postRouter.post("/posts/:id/comment", userAuth, async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) throw new Error("Post not found");

    post.comments.push({ userId: req.user._id, content });
    await post.save();

    // 🔔 Notify post owner
    if (post.userId.toString() !== req.user._id.toString()) {
      await sendNotification(
        post.userId,
        req.user._id,
        "commented",
        `${req.user.firstName} commented on your post`
      );
    }

    const updatedPost = await Post.findById(req.params.id)
      .populate("userId", "firstName lastName photoUrl")
      .populate("comments.userId", "firstName lastName photoUrl");

    res.json({ message: "Comment added", data: updatedPost });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


postRouter.delete("/posts/:id", userAuth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!post) throw new Error("Post not found");
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

postRouter.post("/posts/:id/save", userAuth, async (req, res) => {
  try {
    const postId = req.params.id;

    const user = await User.findById(req.user._id);

    if (!user) throw new Error("User not found");

    const isSaved = user.savedPosts.includes(postId);

    if (isSaved) {
      //Unsave
      user.savedPosts.pull(postId);
      await user.save();
      return res.json({ message: "Post unsaved" });
    } else {
      user.savedPosts.push(postId);
      await user.save();
      return res.json({ message: "Post saved" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

postRouter.get("/posts/saved", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedPosts",
      populate: {
        path: "userId",
        select: "firstName lastName photoUrl",
      },
    });
    res.json({data:user.savedPosts});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = postRouter;
