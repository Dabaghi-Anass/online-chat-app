import React, { useEffect, useState, useRef, useContext } from "react";
import http from "../../services/http";
import User from "./User";
import { context as userContext } from "../../context/user";
import socketCtx from "../../context/socket";
import Api from "../../context/api";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const previousSearch = useRef(search);
  const { user: currentUser } = useContext(userContext);
  const socket = useContext(socketCtx);
  const API = useContext(Api);
  const [query, setQuery] = useState("");
  socket?.emit("join-account", currentUser?._id);
  async function getUsers() {
    if (!currentUser) return navigate("/auth");
    const { data } = await http.get(`${API}/api/users`);
    const usersWithouCurrentUser = await data.filter(
      (user) => user?._id !== currentUser?._id
    );
    setUsers((prev) => [...usersWithouCurrentUser]);
    return [...usersWithouCurrentUser];
  }
  useEffect(() => {
    setQuery(previousSearch.current);
    previousSearch.current = search;
  }, [search]);
  const searchUser = async (text) => {
    await getUsers().then((users) => {
      const newUsers = users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(text?.toLowerCase()) ||
          u.email.toLowerCase().includes(text?.toLowerCase())
      );
      setUsers(newUsers);
    });
  };
  const handleChange = ({ target: input }) => {
    setSearch((prev) => input.value);
    searchUser(input.value);
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div className="flex p-2 flex-col items-center w-full mt-12">
      <label
        htmlFor="search"
        className="w-full lg:w-[60%] px-4  text-white flex gap-4 items-center border-b active:border-rose-500 focus:border-rose-500 border-cyan-500"
      >
        <input
          value={search}
          type="search"
          id="search"
          className="w-full h-full bg-transparent p-4 outline-none  "
          placeholder="search users"
          onChange={(e) => handleChange(e)}
        />
        <span
          onClick={() => searchUser(search)}
          className="flex items-center h-full text-4xl hover:text-cyan-500"
        >
          <ion-icon name="search"></ion-icon>
        </span>
      </label>
      <div className="w-full users-container gap-4 p-4 mt-8">
        {users.map(({ fullName, email, gender, _id, isAdmin }) => (
          <User data={{ fullName, email, gender, _id, isAdmin }} key={_id} />
        ))}
      </div>
    </div>
  );
};

export default Users;
