import React, { useContext, useState } from "react";
import { useEffect } from "react";
import Joi from "joi-browser";
import { saveToken } from "../../services/auth";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { context as userContext } from "../../context/user";
import http from "../../services/http";
import SocketCTX from "../../context/socket";
import Api from "../../context/api";
const schema = {
  fullName: Joi.string().min(3).required(),
  _id: Joi.string(),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "ma", "fr", "co"] } })
    .min(3)
    .required(),
  age: Joi.number().min(10).required(),
  phone: Joi.number().required(),
  gender: Joi.string(),
  description: Joi.string().required(),
};
const Profile = () => {
  const { user } = useContext(userContext);
  const socket = useContext(SocketCTX);
  const API = useContext(Api);
  const [isUpdated, setIsUpdated] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [errors, setErrors] = useState({});
  socket?.emit("join-account", currentUser?._id);
  const navigate = useNavigate();
  const updateUser = async () => {
    const { data } = await http.put(
      `${API}/api/users/${user._id}`,
      currentUser
    );
    saveToken(data);
    window.location = "/profile";
  };

  const handleGenderChange = (e) => {
    setCurrentUser((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };
  const handleChange = ({ target: input }) => {
    setCurrentUser((prev) => ({
      ...prev,
      [input.name]: +input.value || input.value,
    }));
    const error = validateProperty(input);
    if (!error) return delete errors?.[input.name];
    setErrors((prev) => ({
      ...prev,
      [input.name]: error?.details?.[0].message,
    }));
  };
  const validateForm = () => {
    const scm = Joi.object(schema);
    const { error } = scm.validate(currentUser);
    return error;
  };
  const getErrors = () => {
    const errorsArray = [];
    for (const key in errors) {
      errorsArray.push(errors[key].trim());
    }
    return errorsArray;
  };
  const validateProperty = (input) => {
    const uniqueSchema = Joi.object({ [input.name]: schema[input.name] });
    const { error } = uniqueSchema.validate({ [input.name]: input.value });
    return error;
  };
  useEffect(() => {
    if (!user || user === {}) {
      return navigate("/auth");
    }
    const mapToUseModel = _.pick(user, [
      "fullName",
      "_id",
      "email",
      "age",
      "gender",
      "description",
      "phone",
    ]);
    setCurrentUser(mapToUseModel);
  }, []);
  useEffect(() => {
    setIsUpdated(currentUser !== user);
  }, [currentUser]);
  const logOut = () => {
    localStorage.removeItem("x-auth");
    document.cookie = "x-auth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location = "/auth";
  };
  return (
    <div className="w-full profile flex flex-col lg:flex-row lg:gap-8 lg:items-start lg:p-8 items-start lg:text-xl gap-4 mt-8 h-fit">
      <div className="w-full bg-[#120130] mt-12 lg:mt-0 flex gap-8 flex-col text-white overflow-y-scroll h-4/5   py-4 px-8 rounded">
        <span className=" text-3xl uppercase font-mono flex items-center justify-between">
          <span>Profile</span>
          <button
            className="  text-[.5em]  bg-rose-500 flex items-center flex-shrink text-white rounded px-4"
            onClick={logOut}
          >
            <span>log out</span>
            <span className="ml-2 text-2xl h-full flex items-center">
              <ion-icon name="log-out-outline"></ion-icon>
            </span>
          </button>
        </span>
        <span className="flex w-full text-3xl justify-between gap-4">
          <input
            title="click to edit"
            name="fullName"
            onChange={(e) => handleChange(e)}
            className={`max-w-[${
              currentUser?.fullName?.trim().length + 1
            }ch] bg-transparent truncate  border-r-4 border-transparent active:border-cyan-400 focus:border-cyan-300 outline-none`}
            value={currentUser.fullName || ""}
          />
          <input
            title="click to edit"
            name="age"
            onChange={(e) => handleChange(e)}
            className="w-[5ch] font-bold text-left bg-transparent  border-l-4 lg:text-right border-transparent active:border-cyan-400 focus:border-cyan-300 outline-none text-cyan-400 "
            value={currentUser.age || ""}
          />
        </span>
        <span className="flex w-full  text-2xl justify-between gap-4">
          <input
            title={currentUser?.email}
            name="email"
            onChange={(e) => handleChange(e)}
            className={`font-bold w-[20ch] flex-shrink truncate text-cyan-400 bg-transparent border-r-4 border-transparent active:border-cyan-400 focus:border-cyan-500 outline-none`}
            value={currentUser.email || ""}
          />
          <select
            name="gender"
            title="click to edit"
            className={`font-bold w-[8ch] text-right border-transparent active:border-cyan-400 focus:border-cyan-500  outline-none ${
              currentUser.gender === "female" ? "rose" : "cyan"
            } bg-transparent`}
            onChange={(e) => handleGenderChange(e)}
            value={currentUser.gender}
          >
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </span>
        <span className="flex w-full  mt-4 border-r-4 border-transparent active:border-cyan-400 focus:border-cyan-500 outline-none  text-xl justify-between gap-4">
          <input
            title="click to edit"
            name="description"
            value={currentUser.description || ""}
            className="bg-transparent border-r-4 truncate border-transparent active:border-cyan-400 focus:border-cyan-500 outline-none"
            type="text"
            onChange={(e) => handleChange(e)}
          />
        </span>
        {isUpdated && (
          <button
            disabled={validateForm() !== null ? "disabled" : false}
            className="font-bold bg-[#884ae4] p-4 rounded text-white hover:brightness-105"
            onClick={updateUser}
          >
            save info
          </button>
        )}
      </div>
      <div className="errors flex flex-col items-start gap-4 text-xl p-4 xl:p-0">
        {getErrors().map((e) => (
          <span key={e} className="text-red-500">
            {e}!
          </span>
        ))}
      </div>
    </div>
  );
};

export default Profile;
