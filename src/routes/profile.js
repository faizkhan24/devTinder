const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const authRouter = require("./auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERR:" + err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async(req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error('Invalid Edit Request');
        }

        const loggedUser = req.user;
        Object.keys(req.body).forEach((key)=> (loggedUser[key]=req.body[key]));
       await loggedUser.save();
        res.json(
            {
                message: `${loggedUser.firstName} your profile is updated`,
                data: loggedUser,
            }
        );
       
        
    }
    catch(err){
        res.status(400).json({ message: err.message });

    }
})


authRouter.post("/change-password", userAuth, async(req,res)=>{
    try{
        const {emailId,password,newPassword} = req.body;
        const user = await User.findOne({emailId});

        if(!user){
            throw new Error('User not Found');
        }

        const isMatch = await user.validatePassword(password);

        if(!isMatch){
            throw new Error('Old password is incorrect');
        }
        user.password=newPassword;
        await user.save();
        res.send('Password Changed Successfully!!');



    }
    catch(err){
        res.status(400).send('ERROR :'+err.message);
    }
})

module.exports = profileRouter;
