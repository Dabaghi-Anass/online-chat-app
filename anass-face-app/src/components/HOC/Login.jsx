import React, { useState ,useContext ,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Joi from "joi";
import Input from "../utils/navUtils/input";
import Logo from "../utils/navUtils/app_logo";
import http from "../../services/http";
import { context as userContext } from "../../context/user";
import Api from "../../context/api";
import { saveToken } from "../../services/auth";
const Login = () => {
  const { user: currentUser } = useContext(userContext);
  const  API = useContext(Api);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
      email: " ",
   
    password: " ",
  });
  const schema = {
    email: Joi.string()
      .email({ tlds: { allow: ["com", "net", "ma", "fr", "co"] } })
      .min(3)
      .required(),
    password: Joi.string().min(8).max(15).required(),
  };
  const validateForm = () => {
    const scm = Joi.object(schema)
    const { error } = scm.validate(user);
    return error;
  }
  const loginUser = async (e) => {
    e.preventDefault()
    const error = validateForm();
    if (error) return;
    try {
      const {data} = await http.post(`${API}/api/auth`, user);
      if (!data) return setErrors(prev => ({...prev , email : "invalid email or password"}))
        delete errors.email
      saveToken(data);
      window.location = "/profile";
    } catch (err) {
      console.log(err)
    }
  };

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
  useEffect(() => {
    if (currentUser) return navigate("/profile");
  } ,[])

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
          onSubmit={loginUser}
          className="flex flex-col items-center gap-8 w-full p-8"
        >
          <h1 className="text-center text-white font-semibold text-2xl">
            Login <br /> To Chat With Other Friends
          </h1>
          <div className="flex flex-col gap-4 items-center w-full">
           
            <Input
              value={user.email}
              error={errors.email}
              onChange={(e) => handleChange(e)}
              type="email"
              label="email"
              name="email"
            />
          
            <Input
              value={user.password}
              error={errors.password}
              onChange={(e) => handleChange(e)}
              type="password"
              label="password"
              name="password"
            />

            {validateForm() === undefined && <button
              type="submit"
              className="w-full p-4 rounded-full text-white font-bold text-xl bg-[#be068b] transition duration-250 hover:bg-transparent border border-transparent hover:border-[#be068b]"
            >
              Submit
            </button>}
            <span className="text-gray-400">don't have an account ?</span>
                  <Link to="/register" className="text-[#be068b] hover:text-[#be068b90]">create new account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
