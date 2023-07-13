import React, { useRef, useState, useEffect, useContext } from "react";
import http from "../../services/http";
import Api from "../../context/api";
import SocketCtx from "../../context/socket";
import { getUserById } from "../../services/user";
const getDayName = (num) => {
  switch (num) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    default:
      return "Sunday";
  }
};

const Messages = ({ currentUser, selectedUser }) => {
  const API = useContext(Api);
  const socket = useContext(SocketCtx);
  const [isUiUpdated, setUiUpdated] = useState(false);
  const [messageRef, setMessageRef] = useState("");
  const [messages, setMessages] = useState([]);
  const [action, setAction] = useState();
  const timerRef = useRef();
  var Message = {
    save: async (message) => {
      const { data } = await http.post(`${API}/api/messages`, message);
      return data;
    },
    delete: async (message) => {
      await http.delete(`${API}/api/messages/${message._id}`);
    },
    get: async (sender, reciever) => {
      const { data } = await http.get(
        `${API}/api/messages/${sender}/${reciever}`
      );
      return data;
    },
  };
  const handleChange = ({ target: input }) => {
    setMessageRef((prev) => input.value);
  };
  const showNotif = (n) => {
    const notdiv = document.getElementById("notif");
    notdiv.innerHTML = n;
    notdiv.classList.remove("hidden");
    let id = setTimeout(() => {
      notdiv.classList.add("hidden");
      clearTimeout(id);
    }, 2000);
  };
  const scroll = () => {
    let messageContainer = document.getElementById("messageContainer");
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
  };

  const startPressTimer = (message) => {
    timerRef.current = setTimeout(() => {
      if (message.sender === currentUser._id) {
        setAction(message._id);
      }
    }, 500);
  };
  const handleMouseDown = (message) => {
    startPressTimer(message);
  };
  const handleMouseUp = () => {
    clearTimeout(timerRef.current);
  };
  const sendMessage = async (e) => {
    const date = new Date();
    const time = {
      h: date.getHours(),
      m: date.getMinutes(),
      d: date.getUTCDay(),
    };
    e.preventDefault();
    try {
      const dayName = getDayName(+time.d);
      //call server
      const message = {
        _id: "",
        content: messageRef,
        isliked: false,
        sender: currentUser._id,
        receiver: selectedUser._id,
        sendedAt: `${time.h}:${time.m},${dayName}`,
      };
      setMessageRef("");
      const { data } = await http.post(`${API}/api/messages`, message);
      message._id = data._id;
      setMessages((prev) => [...prev, message]);
      socket.emit("message", message);
    } catch (error) {
      return;
    }
  };

  const getMessages = async () => {
    const data = await Message.get(currentUser._id, selectedUser._id);
    setMessages([...new Set(data)]);
  };
  const likeMessage = async (_id) => {
    let messagesClone = [...messages];
    try {
      let message = messagesClone.find((msg) => msg._id === _id);
      let index = messagesClone.indexOf(message);
      messagesClone[index].isliked = !messagesClone[index].isliked;
      setMessages(messagesClone);
      const { data } = await http.put(`${API}/api/messages/${_id}`);
      socket.emit("like-message", data);
      //call server
    } catch (error) {
      setMessages([...new Set(messagesClone)]);
      return;
    }
  };
  const delMessage = async (id) => {
    try {
      const message = messages.find((m) => m._id === id);
      if (message.sender === currentUser._id) {
        const newmessages = messages.filter((m) => m._id !== id);
        setMessages(newmessages);
        await http.delete(`${API}/api/messages/${id}`);
        socket.emit("delete-message", message);
      }
    } catch (e) {
      return;
    }
  };
  useEffect(() => {
    socket.on("message-deleted", (id) => {
      const messagesClone = messages.filter((m) => m._id !== id);
      setMessages(messagesClone);
    });
    socket.on("message-liked", (data) => {
      let messagesClone = [...messages];
      try {
        let message = messagesClone.find((msg) => msg._id === data._id);
        let index = messagesClone.indexOf(message);
        messagesClone[index] = data;
        setMessages(messagesClone);
        //call server
      } catch (error) {
        setMessages([...new Set(messagesClone)]);
      }
    });
    socket.on("message", async (mess) => {
      await getUserById(mess.sender).then((sender) => {
        showNotif(`${sender.fullName} : ${mess.content}`);
      });
      setMessages((prev) => [...new Set([...prev, mess])]);
    });
  }, []);
  useEffect(() => {
    getMessages();
  }, [selectedUser]);
  useEffect(() => {
    scroll();
  }, [messages]);
  return (
    <>
      <div
        className="xl:w-[100%]  p-0 m-0 w-[100vw] xl:border-l  xl:h-[100%] "
        onClick={() => setAction("")}
      >
        <div className="text-3xl px-3 font-bold flex items-center  ">
          <span>{selectedUser.fullName}</span>
        </div>
        <div
          id="messageContainer"
          className="flex flex-col gap-2 mt-2 h-[58vh] xl:h-[82vh]  overflow-y-scroll p-4"
        >
          {messages.map((m) => (
            <div
              key={m._id}
              onMouseOver={() => {
                if (m.sender === currentUser._id) {
                  setAction(m._id);
                }
              }}
              onMouseLeave={() => setAction("")}
              className={`flex items-center mt-2  flex-wrap justify-start text-xl ${
                m.sender === currentUser._id ? " flex-row-reverse" : ""
              } gap-4`}
            >
              {action === m._id && (
                <button
                  className="transition-all duration-300 bg-red-500 text-2xl p-2 rounded"
                  onClick={() => delMessage(m._id)}
                >
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              )}
              <div
                className={`text-gray-700 max-w-[100%] lg:max-w-[78%] xl:max-w-[70%] ${
                  m.sender === currentUser._id ? "userMessage" : "bg-white"
                } w-fit px-4 py-1 font-normal rounded-xl`}
              >
                <div
                  className="max-w-[100%] break-words"
                  onMouseDown={() => handleMouseDown(m._id)}
                  onMouseUp={() => handleMouseUp(m._id)}
                  onTouchStart={() => handleMouseDown(m._id)}
                  onTouchEnd={() => handleMouseUp(m._id)}
                >
                  {m.content}
                </div>
              </div>
              <span
                className={`text-3xl flex icon items-center ${
                  m.isliked ? "likedMessage" : "text-white"
                }`}
                onClick={() => likeMessage(m._id)}
              >
                <ion-icon style={{ zIndex: 2 }} name="heart"></ion-icon>
              </span>
              <span
                className={`text-[13px] text-gray-100 flex items-center gap-2 ${
                  m.sender === currentUser._id ? "left" : "right"
                }-0`}
              >
                {m.sendedAt}
                <ion-icon name="time-outline"></ion-icon>
              </span>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="fixed bottom-0 z-1 xl:relative w-full  xl:top-0 left-0"
        >
          <div className="text-2xl  text-gray-700 font-3xl flex items-center gap-4 bg-white px-12  lg:px-6 w-full">
            <input
              value={messageRef}
              onChange={(e) => handleChange(e)}
              placeholder="send message"
              className="w-full focus:border-0 active:border-0 py-4  outline-none"
            />
            {messageRef?.length > 0 && (
              <button
                className="text-[#063abe] grid place-content-center"
                onClick={sendMessage}
              >
                <ion-icon name="send"></ion-icon>
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default Messages;
