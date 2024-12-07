const express = require("express");


const app = express();
const {adminAuth , userAuth} = require("./middlewares/auth");
// handle auth middleware for all request GET,POSt

app.use("/admin", adminAuth);

app.post("user/login" , (req,res)=>{
  res.send("User Logged in successfully")
})


app.get("/user", userAuth, (req, res) => {
 
  res.send("User Data Sent");
});
app.get("/admin/getAllData", (req, res) => {
 
  res.send("All Data Sent");
});
app.get("/admin/deleteUser", (req, res) => {
  res.send("Deleted a User");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
