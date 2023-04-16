const User = require("../../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const registerFields = [
  "fullName",
  "email",
  "password",
  "age",
  "gender",
  "description",
  "phone",
];

async function getUsers(req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.send(err).status(404);
  }
}
async function getUser(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    res.json(user);
  } catch (err) {
    res.send(err).status(404);
  }
}
async function postUser(req, res) {
  try {
    const user = new User(_.pick(req.body, registerFields));
    const pass = user.password;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(pass, salt);
    user.password = hashedPassword;
    const { _id, fullName, gender, email, age, phone, description } = user;
    const token = jwt.sign(
      { _id, fullName, email, gender, age, phone, description },
      "jwt-key"
    );
    await user.save();
    res.send(token).status(200);
  } catch (err) {
    res.send(false).status(400);
  }
}
async function updateUser(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.send("user not found");
    for (prop in req.body) {
      if (user[prop]) {
        user[prop] = req.body[prop];
      } else if (prop === "description") {
        user[prop] = req.body[prop];
      }
    }
    await user.save();
    const { _id, fullName, gender, email, age, phone, description } = user;
    const token = jwt.sign(
      { _id, fullName, email, gender, age, phone, description },
      "jwt-key"
    );
    res.json(token);
  } catch (err) {
    res.send(err.message).status(400);
  }
}
async function deleteUser(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.send("user not found");
    await user.delete();
    res.status(200).send(user);
  } catch (err) {
    res.send(err.message).status(400);
  }
}
async function addFriend(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.send("user not found");
    user.friends.push(req.body.id);
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.send(err.message).status(400);
  }
}
async function addFriendRequest(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.send("user not found");
    user.friendRequests.push(req.body.id);
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.send(err.message).status(400);
  }
}

async function cancelFriendRequest(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.send("user not found");
    user.friendRequests.pop(req.params.friend_id);
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.send(err.message).status(400);
  }
}

async function deleteFriend(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.send("user not found");
    user.friends.pop(req.params.friend_id);
    await user.save();
    res.status(200).send(user);
  } catch (err) {
    res.send(err.message).status(400);
  }
}
module.exports = {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
  addFriendRequest,
  cancelFriendRequest,
  getUser,
};
