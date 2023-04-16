const Message = require("../../models/messages");
const _ = require("lodash");
async function getMessages(req, res, query) {
  try {
    const messages = await Message.find(query);
    res.json(messages);
  } catch (err) {
    res.send(err).status(404);
  }
}
async function getMessage(req, res) {
  try {
    const message = await Message.findOne({_id : req.params.id});
    res.json(message);
  } catch (err) {
    res.send(err).status(404);
  }
}

async function sendMessage(req, res) {
  try {
    const message = new Message(
      _.pick(req.body, ["content", "sender", "receiver", "isliked", "sendedAt"])
    );
    await message.save();
    res.json(message);
  } catch (err) {
    res.send(err).status(404);
  }
}
async function likeMessage(req, res) {
  try {
    const message = await Message.findOne({ _id: req.params.id });
    if (!message) return;
    message.isliked = !message.isliked;
    await message.save();
    res.json(message);
  } catch (err) {
    res.send(err).status(404);
  }
}
async function deleteMessage(req, res) {
  try {
    const message = await Message.findOne({ _id: req.params.id });
    await message.delete();
    res.json(message);
  } catch (err) {
    res.send(err).status(404);
  }
}
module.exports = {
  getMessages,
  sendMessage,
  likeMessage,
  deleteMessage,
  getMessage
};
