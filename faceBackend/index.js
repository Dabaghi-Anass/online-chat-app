const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const asyncHandler = require("express-async-handler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");
const usersRoute = require("./routes/users");
const messageRoute = require("./routes/messages");
const auth = require("./routes/auth");
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(cookieParser());
app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://anassDabaghi:Anassking1@cluster0.liej1dy.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));
const io = socketio(server, {
  cors: { origin: "*" },
});
app.set("json spaces", 2);
app.use("/api/users", usersRoute);
app.use("/api/messages", messageRoute);
app.use("/api/auth", auth);
const PORT = process.env.PORT || 5000;
asyncHandler(app);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/PUBLIC/index.html"));
});
io.on("connection", (socket) => {
  socket.on("login", (user) => {
    if (user !== {}) {
      socket.broadcast.emit("user-online", user);
    }
  });
  socket.on("join-chat", (data) => {
    socket.join(data);
  });
  socket.on("message", (message) => {
    const { sender, receiver } = message;
    socket.to(`${receiver}&${sender}`).emit("message", message);
  });
  socket.on("delete-message", (message) => {
    const { sender, receiver } = message;
    socket.to(`${receiver}&${sender}`).emit("message-deleted", message._id);
  });
  socket.on("like-message", (message) => {
    const { sender, receiver } = message;
    socket.to(`${receiver}&${sender}`).emit("message-liked", message);
  });
});
server.listen(PORT, console.log(`info : app listening on port ${PORT}...`));
