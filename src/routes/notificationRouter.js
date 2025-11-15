const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Notification = require("../models/notification");

const notificationRouter = express.Router();

// Get all notifications for logged user
// routes/notificationRouter.js

// Get all notifications for logged user
notificationRouter.get("/notifications", userAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({ toUserId: req.user._id })
      .populate("fromUserId", "firstName lastName photoUrl")
      .sort({ createdAt: -1 });

    res.json({ data: notifications });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});





// Mark all as read
// Mark all as read
notificationRouter.post("/notifications/read-all", userAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { toUserId: req.user._id },
      { $set: { read: true } }
    );

    res.json({ message: "Notifications marked as read" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = notificationRouter;
