import React, { useContext, useEffect, useState, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  addFriend,
  cancelRequest,
  getRequestsFromServer,
} from "../../services/user";
import { context as userContextProvider } from "../../context/user";
import Load from "../utils/navUtils/load";

const Requests = () => {
  const navigate = useNavigate();
  const [pending, startTrannsition] = useTransition();
  const [data, setData] = useState();
  const { user: currentUser } = useContext(userContextProvider);

  const getRequests = async (userId) => {
    try {
      const requests = await getRequestsFromServer(userId);
      setData([...new Set(requests)]);
    } catch (error) {
      console.log(error);
    }
  };
  const acceptRequest = async (id) => {
    const { _id } = currentUser;
    try {
      await addFriend(id, _id);
      await cancelRequest(id, _id);
      navigate("/friends");
    } catch (error) {
      return;
    }
  };
  const declineRequest = async (id) => {
    const { _id } = currentUser;
    try {
      await cancelRequest(id, _id);
      navigate("/friends");
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    startTrannsition(() => {
      if (!currentUser?.email) return (window.location = "/auth");
      getRequests(currentUser._id);
    });
  }, []);
  return (
    <>
      {pending && <Load />}
      {!pending && (
        <div className="mt-8 w-full flex justify-center items-center">
          {!data?.[0] && (
            <div className="w-full  h-full grid place-items-center text-2xl text-white mt-24 ">
              <span>there are no friend requests</span>
            </div>
          )}
          {data?.[0] && (
            <div className="lg:w-3/4 w-full mt-8">
              <div className="w-full text-white bg-[#2b1b31]  py-4 px-8 rounded">
                <h1 className=" text-3xl font-semibold flex items-center  gap-4">
                  <span>Requests</span>
                  <span
                    className={`text-xl bg-red-500 ${
                      data?.length < 10
                        ? "px-3"
                        : data?.length < 99
                        ? "px-1"
                        : "p-1"
                    } text-white rounded-[50%]`}
                  >
                    {data?.length}
                  </span>
                </h1>
                <ul className="w-full lg:h-fit overflow-y-scroll mt-8">
                  {data?.map((f) => (
                    <li
                      key={f._id}
                      className="w-full flex items-center mt-1 justify-between text-2xl py-2 border-b border-gray-300"
                    >
                      <span>{f.fullName}</span>
                      <span className="flex items-center gap-4">
                        <button
                          className="text-[#be068b]"
                          onClick={() => acceptRequest(f._id)}
                        >
                          accept
                        </button>
                        <button onClick={() => declineRequest(f._id)}>
                          decline
                        </button>
                        <Link to={`/profile/${f._id}`}>profile</Link>
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

export default Requests;
