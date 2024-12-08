const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://namasteNode:vTEI3xuKEhbuUrA9@namastenode.qfz3u.mongodb.net/devTinder"
  );
};

module.exports = connectDB;

