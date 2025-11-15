const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName gender skills photoUrl age about";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data Fetched Successfully! ",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedUser._id, status: "accepted" },
        { fromUserId: loggedUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      // If I am the sender, show the receiver
      if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
        return row.toUserId;
      }
      // If I am the receiver, show the sender
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const page = parseInt(req.query.page)||1;
    const limit = parseInt(req.query.limit)||10;

    const skip = (page-1)*limit;


    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedUser._id }, { toUserId: loggedUser._id }],
    })
      .select("fromUserId toUserId")

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedUser._id } },
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.json({data:user});
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/user/:id", userAuth, async(req,res)=>{
  try{
    const loggedUser = req.user;
    const {id} = req.params;
    if(id===loggedUser.id.toString()){
      return res.redirect("/profile/view");
    }

    const user = await User.findById(id).select("firstName lastName age gender about skills photoUrl coverPhotoUrl");

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    res.json({data:user});
  }
  catch(err){
    res.status(400).json({message:err.message});
  }
})

module.exports = userRouter;
