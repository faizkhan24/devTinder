const mongoose = require("mongoose");

const connectDB = async()=>{
  await  mongoose.connect('mongodb+srv://khanfaiz33897_db_user:Wnr9MEEqQeKXtbpB@cluster0.lcpegxw.mongodb.net/devTinder');
}

module.exports = connectDB;