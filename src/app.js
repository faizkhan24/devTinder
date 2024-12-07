const express = require("express");
const connectDB =  require('./config/database');

const app = express();
const User = require('./models/user')

app.post("/signup", async  (req,res)=>{
const userObj = {
  firstName: "virat",
  lastName: "kohli",
  emailId: "virat@kohli.com",
  password:"virat@123",
}
// Creating a new instance of the User Model
const user = new User(userObj);


try{
  await user.save();
res.send('User Added Successfully!!')
}
 catch(err) {
  res.status(400).send("Error saving the user :"+ err.message)
 }

})

connectDB().then(()=>{
  console.log('Database connection established');
  app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000...");
  });
  }).catch(err =>{
   console.error('Database cannot be connected!!');
   
  })



