const express = require("express");
const Story = require("../models/story");
const { userAuth } = require("../middlewares/auth");
const upload = require("../middlewares/uploadStory");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const storyRouter = express.Router();

// 👉 1. Upload Story
storyRouter.post(
  "/story",
  userAuth,
  upload.single("media"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Cloudinary URL
      const mediaUrl = req.file.path;

      // Detect type
      const mediaType = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";

      const story = await Story.create({
        userId: req.user._id,
        mediaUrl,
        mediaType,
      });

      res.json({
        message: "Story uploaded successfully",
        story,
      });
    } catch (err) {
      console.log("❌ Story upload error:", err);
      res.status(500).json({
        error: "Something went wrong",
        details: err.message,
      });
    }
  }
);

// 👉 2. Get stories
storyRouter.get("/stories", userAuth, async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("userId", "firstName lastName photoUrl")
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👉 3. Delete Story
storyRouter.delete("/story/:id", userAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Story.findByIdAndDelete(req.params.id);

    res.json({ message: "Story deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = storyRouter;
