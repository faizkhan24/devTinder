const Notification = require("../models/notification");

async function sendNotification(toUserId, fromUserId, type, message) {
  try {
    const notification = await Notification.create({
      toUserId,
      fromUserId,
      type,
      message,
    });

    return notification;
  } catch (err) {
    console.error("Error sending notification:", err.message);
    throw err;
  }
}

module.exports = sendNotification;
