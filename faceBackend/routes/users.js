const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
  addFriend,
  getUser,
  addFriendRequest,
  deleteFriend,
  cancelFriendRequest,
} = require("./methods/user--Methods.js");
router.get("/", auth, (req, res) => getUsers(req, res));
router.get("/:id", auth, (req, res) => getUser(req, res));
router.post("/", (req, res) => postUser(req, res));
router.put("/:id", auth, (req, res) => updateUser(req, res));
router.delete("/:id", auth, (req, res) => deleteUser(req, res));
router.post("/:id/friends", auth, (req, res) => addFriend(req, res));
router.post("/:id/requests", auth, (req, res) => addFriendRequest(req, res));
router.delete("/requests/:id/:friend_id", auth, (req, res) =>
  cancelFriendRequest(req, res)
);
router.delete("/:id/:friend_id", auth, (req, res) => deleteFriend(req, res));
module.exports = router;
