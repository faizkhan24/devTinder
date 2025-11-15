const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // receiver
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // sender
    type: { type: String },
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
