const express = require("express");
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // const userObj = {
  //   firstName: "MS",
  //   lastName: "Dhoni",
  //   emailId: "dhoni@.com",
  //   password:"dhoni@123",
  // }
  // Creating a new instance of the User Model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added Successfully!!");
  } catch (err) {
    res.status(400).send("Error saving the user :" + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User Not Found");
    } else {
      res.send(user);
    }

    // if (users.length === 0) {
    //   res.status(404).send("User Not Found");
    // } else {
    //   res.send(users);
    // }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// app.get("/user", async (req, res) => {
//   const userId = req.query._id; // Use query parameters for GET requests

//   try {
//     const user = await User.findById(userId); // Pass userId directly
//     if (!user) {
//       res.status(404).send("User Not Found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong: " + err.message);
//   }
// });

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;


  try {

    const ALLOWED_UPDATE = [
       "photoUrl", "about", "gender", "age", "skills"
     ]
   
     const isUpdateAllowed = Object.keys(data).every(x=> ALLOWED_UPDATE.includes(x));
   
     if(!isUpdateAllowed) {
       throw new Error('Update not allowed');
     }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);

    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED :"+err.message);
  }
});

// app.patch("/user", async (req, res) => {
//   const userEmail = req.body.emailId; // Extract email ID from request body
//   const data = req.body; // The data to update

//   try {
//     const user = await User.findByIdAndUpdate(
//       { emailId: userEmail }, // Find user by email
//       data,
//     );

//     if (!user) {
//       return res.status(404).send("User Not Found");
//     }

//     res.send({
//       message: "User Updated Successfully",
      
//     });
//   } catch (err) {
//     res.status(400).send("Something went wrong: " + err.message);
//   }
// });
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
