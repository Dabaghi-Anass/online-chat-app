import React, { useState, useEffect, useTransition, useContext } from "react";
import { context as userContextProvider } from "../../context/user";
import { Link, useLocation } from "react-router-dom";
import http from "../../services/http";
import Messages from "./messages.jsx";
import Api from "../../context/api";
import Logo from "../utils/navUtils/app_logo";
import SocketCtx from "../../context/socket";
const Chat = () => {
  const socket = useContext(SocketCtx);
  const location = useLocation();
  const commingUser = location.state;
  const [pending, startTrannsition] = useTransition();
  const [isDataShown, setIsDataShown] = useState(true);
  const [selectedUser, setSelectedUser] = useState();
  const [data, setData] = useState([]);
  const { user: currentUser } = useContext(userContextProvider);
  const API = useContext(Api);
  socket?.emit("join-account", currentUser?._id);
  const getFriends = async (userId) => {
    try {
      const { data: friends } = await http.get(
        `${API}/api/users/friends/${userId}`
      );
      setData(friends);
    } catch (error) {
      console.log(error);
    }
  };
  const joinChat = (f) => {
    setSelectedUser(f);
    socket?.emit("join-chat", `${f._id}&${currentUser._id}`);
    socket?.emit("join-chat", `${currentUser._id}&${f._id}`);
  };
  useEffect(() => {
    startTrannsition(() => {
      if (!currentUser?.email) return (window.location = "/auth");
      getFriends(currentUser._id);
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1279) {
        setIsDataShown(true);
      }
    });
    if (commingUser) {
      joinChat(commingUser);
    }
  }, []);

  return (
    <>
      {pending && <div className="text-5xl text-white ">loading...</div>}
      {!pending && (
        <div className="text-white xl:flex xl:h-[93vh] mt-6">
          <div className="min-w-[35%] h-full">
            <div className="flex items-center w-full justify-between px-2">
              <button
                className="font-bold text-3xl"
                onClick={() => setSelectedUser(false)}
              >
                Chat
              </button>
              <button
                className=" text-4xl xl:hidden mr-3"
                onClick={() => {
                  setIsDataShown((prev) => !prev);
                }}
              >
                <ion-icon name="chatbubble-ellipses"></ion-icon>
              </button>
            </div>
            {isDataShown && (
              <ul className=" w-full xl:max-h-[70vh] overflow-y-scroll p-2  items-start max-h-[60vh]">
                {data.map((f) => (
                  <li
                    key={f._id}
                    onClick={() => joinChat(f)}
                    className={`${
                      f._id === selectedUser._id ? "selec" : ""
                    }  w-full flex items-center  justify-between text-xl  py-2 px-1 border-b hover:brightness-110 hover:bg-gray-100 hover:bg-opacity-5 border-gray-300`}
                  >
                    <span>{f.fullName}</span>
                    <span className="flex items-center gap-4">
                      <Link to={`/profile/${f._id}`} className="text-[#be068b]">
                        view
                      </Link>
                      <button onClick={() => joinChat(f)}>message</button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {!selectedUser && (
            <div className="text-2xl w-full flex flex-col items-center gap-4 py-24 xl:py-0 xl:mt-0 xl:border-l xl:pt-12">
              <span>
                <Logo width={`6rem`} />
              </span>
              <span>chat with your friends</span>
            </div>
          )}
          {selectedUser && (
            <Messages currentUser={currentUser} selectedUser={selectedUser} />
          )}
        </div>
      )}
    </>
  );
};

export default Chat;
