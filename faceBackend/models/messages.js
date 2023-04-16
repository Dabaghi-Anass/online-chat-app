const mongoose = require("mongoose");
const date = new Date();
const time = {
  h: date.getHours(),
  m: date.getMinutes(),
};
const messageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  receiver: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  sendedAt: {
    type: String,
  },
  isliked: Boolean,
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
