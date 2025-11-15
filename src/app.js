const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const user = require("./models/user");

const cookieParser = require("cookie-parser");

const cors = require('cors');
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const notificationRouter = require('./routes/notificationRouter')

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", postRouter);
app.use('/',notificationRouter);



connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Sever is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
