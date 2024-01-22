import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logoImg from "../../assets/Hefson_logo.svg";

import { login } from "../../actions/user";
import Cookies from "js-cookie";
import { useEffect } from "react";
import * as api from "../../api/index";
import { socket } from "../../socket";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

const loggedRole = Cookies.get("role") ? JSON.parse(Cookies.get("role")) : "";

function LogIn() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (loginToken !== null) {
      socket.emit("authenticate", { token: loginToken });
      validateToken();
    }
  }, []);

  const validateToken = async () => {
    if (loginToken) {
      const { data } = await api.validateToken({ token: loginToken });

      if (data?.data?.tokenVerify === true) {
        if (loggedRole === 1) {
          navigate("/admin-dashboard");
        } else if (loggedRole === 2) {
          navigate("/home");
        } else {
          Cookies.remove("loginToken");
          Cookies.remove("role");
        }
      } else {
        Cookies.remove("loginToken");
        Cookies.remove("role");
      }
    }
  };

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const hasError = Object.values(errors).some((error) => error);

    if (loginData.email === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required.",
      }));
    } else if (loginData.password === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: null,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: null,
      }));
    }

    if (!hasError && loginData.email !== "" && loginData.password !== "") {
      socket.emit("authenticate", { token: loginToken });
      dispatch(login(loginData));
    }
  };

  const handleEmailBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required.",
      }));
    } else if (value !== "") {
      // Regex pattern for email validation
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

      // Check if the input value matches the email pattern
      const isValid = emailRegex.test(value);
      if (isValid === false) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter correct email.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: null,
        }));
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: null,
      }));
    }
  };

  const handlePasswordBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required.",
      }));
    } else if (value !== "" && (value.length < 6 || value.length > 18)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password length should be between 6 and 18",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: null,
      }));
    }
  };
  return (
    <div className="auth">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <Link to="https://hefson.com/">
              <img className="logo" src={logoImg} alt="logo" />
            </Link>
          </div>

          <div className="col-lg-6 col-md-8 m-auto centerMid">
            <div className="content">
              <h1>Welcome Back!</h1>
              <h2>Sign In</h2>
              <p className="note">
                Enter your email and password for signing in. Thanks
              </p>
              <form action="" onSubmit={submitHandler}>
                <div className="row">
                  <div className="col-12">
                    <div className="inputField">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                        name="email"
                        value={loginData?.email}
                        onChange={(e) => {
                          {
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            });
                            handleEmailBlur(e);
                          }
                        }}
                        onBlur={(e) => handleEmailBlur(e)}
                      />
                      <img src="./assets/icons/email.svg" alt="" />
                    </div>
                    {errors.email && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.email}
                      </h6>
                    )}
                  </div>
                  <div className="col-12 mt-25">
                    <div className="inputField">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        value={loginData?.password}
                        onChange={(e) => {
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          });
                          handlePasswordBlur(e);
                        }}
                        onBlur={(e) => handlePasswordBlur(e)}
                      />
                      <img src="./assets/icons/lock.svg" alt="" />
                    </div>
                    {errors.password && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.password}
                      </h6>
                    )}
                  </div>
                  <div className="col-12 mt-15">
                    <div className="spaceBetween">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Keep me signed in
                        </label>
                      </div>
                      <div className="link">
                        <Link to="/forgot-password">Forgot Your Password</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mt-20">
                    <button className="btn btn-main w-100">SIGN IN</button>
                  </div>
                </div>
              </form>
              <p className=" mt-4 mb-0">
                Don’t have an account yet? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
