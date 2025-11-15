const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const sendNotification = require("../utils/sendNotification");



const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status Type:" + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send({ message: "User id does not exist!!" });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send({ message: "Connection Request Already Exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // 🔔 SEND NOTIFICATION when someone is interested
      if (status === "interested") {
        await sendNotification(
          toUserId,
          fromUserId,
          "interested",
          `${req.user.firstName} is interested in you`
        );
      }

      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR :" + err.message);
    }
  }
);



requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedUser = req.user; // Faiz
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed!!" });
      }

      // Find the request where logged user (Faiz) is RECEIVER
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({ message: "Connection request not found" });
      }

      // Update status
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      // 🔔 NOTIFICATION: ACCEPTED
      if (status === "accepted") {
        await sendNotification(
          connectionRequest.fromUserId,   // Shradha receives
          loggedUser._id,                 // Faiz sends
          "accepted",
          `${loggedUser.firstName} accepted your request`
        );
      }

      return res.json({
        message: `Connection request ${status}`,
        data,
      });

    } catch (err) {
      return res.status(500).json({ message: "ERROR: " + err.message });
    }
  }
);



module.exports = requestRouter;
