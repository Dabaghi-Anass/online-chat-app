const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    min: 3,
  },
  email: {
    type: String,
    required: true,
    min: 5,
    unique: true,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  age: {
    type: Number,
    required: true,
    min: 8,
    max: 200,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  friends: {
    type: [mongoose.SchemaTypes.ObjectId],
  },
  friendRequests: {
    type: [mongoose.SchemaTypes.ObjectId],
  },
  description: {
    type: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  isAdmin: Boolean,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
