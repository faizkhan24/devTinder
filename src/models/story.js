const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mediaUrl: {
      type: String,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

// ✅ TTL Index: Auto delete after 24 hours
storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

module.exports = mongoose.model("Story", storySchema);
