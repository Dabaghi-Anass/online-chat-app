import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { context as userContext } from "../../context/user";
import Api from "../../context/api";
import { saveToken } from "../../services/auth";
import Joi from "joi";
import Input from "../utils/navUtils/input";
import Logo from "../utils/navUtils/app_logo";
import http from "../../services/http";
const schema = {
  fullName: Joi.string().min(3).required(),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "ma", "fr", "co"] } })
    .min(3)
    .required(),
  age: Joi.number().min(10).required(),
  gender: Joi.required(),
  phone: Joi.number().required(),
  password: Joi.string().min(8).max(15).required(),
};
const Register = () => {
  const { user: currentUser } = useContext(userContext);
  const API = useContext(Api);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    age: "",
    phone: "",
    gender: "male",
    password: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    age: 0,
    phone: 0,
    password: "",
  });
  const validateForm = () => {
    const scm = Joi.object(schema);
    const { error } = scm.validate(user);
    return error;
  };
  const registerUser = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return;
    try {
      const { data } = await http.post(`${API}/api/users`, {
        ...user,
        description: "hello i am using face",
      });
      if (!data)
        return setErrors((prev) => ({
          ...prev,
          email: "user found with this email",
        }));
      delete errors.email;
      saveToken(data);
      window.location = "/profile";
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (currentUser) return navigate("/profile");
  });
  const validateProperty = ({ name, value }) => {
    const inputSchema = Joi.object({
      [name]: schema[name],
    });
    const { error } = inputSchema.validate({ [name]: value });
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error.details[0].message,
      }));
    } else {
      delete errors[name];
    }
  };

  const handleChange = ({ target: input }) => {
    setUser((prev) => ({
      ...prev,
      [input.name]: parseInt(input.value) || input.value,
    }));
    validateProperty(input);
  };
  return (
    <div className="w-full flex justify-center pt-8">
      <div className="login flex flex-col items-center justify-center gap-8">
        <Logo width="10rem" height="10rem" />
        <form
          onSubmit={registerUser}
          className="flex flex-col items-center gap-8 w-full p-8"
        >
          <h1 className="text-center text-white font-semibold text-2xl">
            Register <br /> To Chat With Other Friends
          </h1>
          <div className="flex flex-col gap-4 items-center w-full">
            <div className="block  text-sm font-medium text-gray-300">
              full name
            </div>
            <Input
              value={user.fullName}
              error={errors?.fullName}
              onChange={(e) => handleChange(e)}
              type="text"
              label="full name"
              name="fullName"
            />
            <div className="block  text-sm font-medium text-gray-300">
              email
            </div>
            <Input
              value={user.email}
              error={errors?.email}
              onChange={(e) => handleChange(e)}
              type="email"
              label="email"
              name="email"
            />
            <div className="block  text-sm font-medium text-gray-300">age</div>
            <Input
              value={user.age}
              error={errors?.age}
              onChange={(e) => handleChange(e)}
              type="number"
              label="age"
              name="age"
            />
            <div className="block  text-sm font-medium text-gray-300">
              phone number
            </div>
            <Input
              value={user.phone}
              error={errors?.phone}
              onChange={(e) => handleChange(e)}
              type="number"
              label="phone"
              name="phone"
            />
            <div className="block  text-sm font-medium text-gray-300">
              Select gender
            </div>
            <select
              defaultValue="male"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
            >
              <option value="male" className=" dark:bg-slate-600 bg-gray-700">
                male
              </option>
              <option
                value="female"
                className="py-3 dark:bg-slate-600 bg-gray-700"
              >
                female
              </option>
            </select>
            <div className="block  text-sm font-medium text-gray-300">
              password
            </div>
            <Input
              value={user.password}
              error={errors?.password}
              onChange={(e) => handleChange(e)}
              type="password"
              label="password"
              name="password"
            />
            {validateForm() === undefined && (
              <button
                type="submit"
                className="w-full p-4 rounded-full text-white font-bold text-xl bg-[#ff004c] transition duration-250 hover:bg-transparent border border-transparent hover:border-[#ff004c]"
              >
                Submit
              </button>
            )}
            <span className="text-gray-400">already have an account ?</span>
            <Link to="/auth" className="text-[#ff004c] hover:text-[#ff004c90]">
              go to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
