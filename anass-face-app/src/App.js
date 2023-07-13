import "./App.css";
import React, { useEffect, useState, useTransition } from "react";
import { context as userContext } from "./context/user";
import Api from "./context/api";
import { getCurrentUser } from "./services/auth";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { NavBar } from "./components/utils/navUtils/navigation";
import Load from "./components/utils/navUtils/load";
import io from "socket.io-client";
import Login from "./components/HOC/Login";
import Register from "./components/HOC/Register";
import Profile from "./components/HOC/Profile";
import Chat from "./components/HOC/Chat";
import NotFound from "./components/HOC/NotFound";
import Friends from "./components/HOC/Friends";
import Users from "./components/HOC/users";
import UserProfile from "./components/HOC/generaleProfile";
import Requests from "./components/HOC/requests";
import SocketCtx from "./context/socket";
import "react-toastify/dist/ReactToastify.css";
const API = process.env.REACT_APP_API;

function App() {
  const [pending, startLoading] = useTransition();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [socket, setSocket] = useState();
  useEffect(() => {
    const newSocket = io(`${API}`);
    startLoading(() => {
      if (!user) {
        return navigate("/auth");
      }
      if (!API) return;
      setSocket(newSocket);
    });
    return () => {
      newSocket.close();
    };
  }, []);
  useEffect(() => {
    document.title = `Face - ${window.location.pathname.replace("/", "")}`;
  });
  return (
    <SocketCtx.Provider value={socket}>
      <Api.Provider value={API}>
        <userContext.Provider value={{ user }}>
          <div className="App">
            <div
              id="notif"
              className="bg-[#4f2360] hidden text-white transition duration-300 truncate left-[50%] translate-x-[-50%] top-15 shadow-md shadow-[#954ab3] bg-opacity-90 p-4 lg:w-[40%] w-[80%] fixed text-2xl text-center rounded-xl border-2 border-indigo-500"
            ></div>
            <NavBar />
            {pending && <Load />}
            {!pending && (
              <div className="mt-24 over-all-container">
                <Routes>
                  <Route
                    path="/"
                    exact
                    element={<Navigate replace to="/users" />}
                  />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:id" element={<UserProfile />} />
                  <Route path="/messages" element={<Chat />} />
                  <Route path="/profile/delete" element="profile delete" />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/friends" element={<Friends />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/auth" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/not-found" element={<NotFound />} />
                  <Route
                    path="*"
                    element={<Navigate replace to="/not-found" />}
                  />
                </Routes>
              </div>
            )}
          </div>
        </userContext.Provider>
      </Api.Provider>
    </SocketCtx.Provider>
  );
}

export default App;
