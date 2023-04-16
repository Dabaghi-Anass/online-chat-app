import React, {
  useTransition,
  useEffect,
  useState,
  useContext,
  useReducer,
} from "react";
import {
  addFriend,
  getUserById,
  deleteFriend,
  cancelRequest,
  requestFriendship,
} from "../../services/user";
import { context as userContext } from "../../context/user";
import { useNavigate, useParams } from "react-router-dom";
import Load from "../utils/navUtils/load";

function getAction(state, action) {
  switch (action.name) {
    case "add":
      return {
        name: "add",
        label: "add friend",
        class: "green",
        icon: "add-circle-outline",
      };
    case "cancel":
      return {
        name: "cancel",
        label: "cancel request",
        class: "gold",
        icon: "arrow-undo-outline",
      };
    case "unfriend":
      return {
        name: "unfriend",
        label: "unfriend",
        class: "red",
        icon: "trash-outline",
      };
    case "accept":
      return {
        name: "accept",
        label: "accept",
        class: "indigo",
        icon: "person-add-outline",
      };
  }
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, startLoading] = useTransition();
  const { user: currentUser } = useContext(userContext);
  const [user, setUser] = useState({});
  const [clicked, setClicked] = useState(false);
  const [action, dispatch] = useReducer(getAction, {
    name: "add",
    label: "add friend",
    class: "emerald",
    icon: "add-circle-outline",
  });
  const getUser = async (id) => {
    try {
      const user = await getUserById(id);
      if (!user.fullName) return (window.location = "/not-found");
      setUser(user);
      return user;
    } catch (error) {
      return;
    }
  };
  const getActionButton = (action) => {
    return (
      <button
        name={action.name}
        className={` ${action.class} flex items-center  text-[.5em] text-white hover:brightness-110 rounded px-4`}
        onClick={async () => await handleFriendshipAction(action.name)}
      >
        <div>{action.label}</div>
        <div className="ml-2 text-sm  sm:text-xl h-full flex items-center">
          <ion-icon name={action.icon}></ion-icon>
        </div>
      </button>
    );
  };

  const handleFriendshipAction = async (action) => {
    const { _id } = currentUser;
    try {
      switch (action) {
        case "add":
          dispatch({name : "cancel"})
          await requestFriendship(id, _id);
          return;
        case "cancel":
            dispatch({name : "add"})
          await cancelRequest(id, _id);
          return;
        case "unfriend":
            dispatch({ name: "add" });
            await deleteFriend(id, _id);
            return;
        case "accept":
            dispatch({name : "unfriend"})
          await addFriend(id, _id);
          await cancelRequest(id, _id);
          navigate("/friends");
          return;
        }
        setClicked((prev) => !prev);
    } catch (error) {
      setClicked((prev) => !prev);
      return;
    }
  };
  const detectActionType = async () => {
    const { _id } = currentUser;
    const userFromServer = await getUserById(id);
    const currentUserFromServer = await getUserById(_id);
    try {
      for (const myrequest of currentUserFromServer.friendRequests) {
        if (myrequest === id) {
          dispatch({ name: "accept" });
          return;
        }
      }
      for (const request of userFromServer.friendRequests) {
        if (request === _id) {
          dispatch({ name: "cancel" });
          return;
        }
      }
      for (const friend of userFromServer.friends) {
        if (friend === currentUser._id) {
          dispatch({ name: "unfriend" });
          return;
        }
      }
      for (const friend of currentUserFromServer.friends) {
        if (friend === id) {
          dispatch({ name: "unfriend" });
          return;
        }
      }
      dispatch({ name: "add" });
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (id === currentUser._id) return navigate("/profile");
    startLoading(() => {
      getUser(id);
      detectActionType();
    });
  }, [clicked]);
  return (
    <div className="w-full UserProfile flex flex-col lg:flex-row lg:gap-8 lg:items-start lg:p-8 items-start lg:text-xl gap-4 mt-8 h-fit">
      {isLoading && <Load />}
      {!isLoading && (
        <div className="w-full mt-12 lg:mt-0 flex gap-8 flex-col bg-[#2b1b31]  text-white overflow-y-scroll h-4/5  py-4 px-8 rounded">
          <span className=" text-3xl font-mono uppercase flex items-center justify-between">
            <span>Profile</span>
            {getActionButton(action)}
          </span>
          <span className="flex w-full  text-3xl justify-between gap-4">
            <span>{user.fullName || ""}</span>
            <span className="font-bold  text-cyan-400">{user.age || ""}</span>
          </span>
          <span className="flex w-full truncate  text-2xl text-cyan-400 justify-between gap-4">
            <span>{user.email || ""}</span>
            <span
              className={`${
                user.gender === "female" ? "rose" : "cyan"
              }`}
            >
              {user.gender === "male" ? `male` : `female`}
              <span>
                <ion-icon
                  name={user.gender === "male" ? `man` : `woman`}
                ></ion-icon>
              </span>
            </span>
          </span>
          <span className="flex w-full mt-4 pb-8  text-xl justify-between gap-4">
            {user.description && <span>{user.description}</span>}
          </span>
        </div>
      )}
    </div>
  );
};
export default UserProfile;
