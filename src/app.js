const express = require("express");

const app = express();

app.use(
  "/user",
  (req, res,next) => {
    // Route Handler
    // res.send("Route Handler 1");
    console.log("Handling Route User 1");
    next();
  },
  (req,res,next) => {
    // route handler 2
    // res.send("Route Handler 2");
    console.log("Handling Route User 2 ");
    next();
    
  },
  (req,res,next) => {
    // route handler 2
    // res.send("Route Handler 3");
    console.log("Handling Route User 3 ");
    next();
    
  },
  (req,res,next) => {
    // route handler 2
    // res.send("Route Handler 4");
    console.log("Handling Route User 4 ");
    next();
    
  },  (req,res,next) => {
    // route handler 2
    res.send("Route Handler 5");
    console.log("Handling Route User 5 ");
    
    
  }

);

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000...");
});
