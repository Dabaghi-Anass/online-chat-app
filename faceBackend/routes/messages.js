const express = require("express");
const router = express.Router();
const {
  deleteMessage,
  getMessages,
  getMessage,
  sendMessage,
  likeMessage,
} = require("./methods/message--Methods.js");

router.get("/:sender/:receiver", (req, res) =>
  getMessages(req, res, {
    sender: { $in: [req.params.sender, req.params.receiver] },
    receiver: { $in: [req.params.sender, req.params.receiver] },
  })
);
router.get("/:id", (req, res) => getMessage(req, res));
router.post("/", (req, res) => sendMessage(req, res));
router.delete("/:id", (req, res) => deleteMessage(req, res));
router.put("/:id", (req, res) => likeMessage(req, res));
module.exports = router;
