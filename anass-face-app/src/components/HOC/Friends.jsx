import React, { useContext, useEffect, useState, useTransition } from "react";
import http from "../../services/http";
import { Link } from "react-router-dom";
import Api from "../../context/api";
import { context as userContextProvider } from "../../context/user";
import socketctx from "../../context/socket";
const Friends = () => {
  const [pending, startTrannsition] = useTransition();
  const socket = useContext(socketctx);
  const [data, setData] = useState([]);
  const { user: currentUser } = useContext(userContextProvider);
  const API = useContext(Api);
  socket?.emit("join-account", currentUser?._id);
  const getFriends = async (userId) => {
    try {
      const { data: friends } = await http.get(`${API}/api/users/friends/${userId}`);
      setData([...new Set(friends)]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    startTrannsition(() => {
      if (!currentUser?.email) return (window.location = "/auth");
      getFriends(currentUser._id);
    });
  }, []);
  return (
    <>
      {pending && <h1 className="text-6xl text-white p-8 ">loading...</h1>}
      {!pending && (
        <div className="mt-8 w-full flex justify-center items-center">
          {!data[0] && (
            <div className="w-full  h-full grid place-items-center text-2xl text-white mt-24 ">
              <span>there are no friends</span>
              <Link
                to="/users"
                className="indigo py-2 px-4 rounded hover:brightness-150 mt-8 uppercase"
              >
                get more friends
              </Link>
            </div>
          )}
          {data[0] && (
            <div className="lg:w-3/4 w-full lg:h-fit mt-8">
              <div className="w-full text-white  lg:bg-opacity-95 py-4 px-8 rounded-xl bg-[#2b1b31]">
                <h1 className=" text-3xl font-semibold  flex items-center  gap-4">
                  <span>Friends</span>
                  <span
                    className={`text-xl bg-red-500 ${
                      data.length < 10
                        ? "px-3"
                        : data.length < 99
                        ? "px-1"
                        : "p-1"
                    } text-white rounded-[50%]`}
                  >
                    {data.length}
                  </span>
                </h1>
                <ul className="w-full lg:h-fit overflow-y-scroll mt-1">
                  {data.map((f) => (
                    <li
                      key={f._id}
                      className="w-full flex items-center mt-8 justify-between text-2xl py-2 border-b border-gray-300"
                    >
                      <span>{f.fullName}</span>
                      <span className="flex items-center gap-4">
                        <Link
                          to={`/profile/${f._id}`}
                          className="text-[#be068b]"
                        >
                          view
                        </Link>
                        <Link to="/messages" state={f}>
                          message
                        </Link>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Friends;
