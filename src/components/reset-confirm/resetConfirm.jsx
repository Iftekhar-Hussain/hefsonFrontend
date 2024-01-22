import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logoImg from "../../assets/Hefson_logo.svg";

import { login } from "../../actions/user";
import Cookies from "js-cookie";

function ResetConfirm() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: Cookies.get("email") ? JSON.parse(Cookies.get("email")) : "",
    password: Cookies.get("password")
      ? JSON.parse(Cookies.get("password"))
      : "",
  });

  if (loginData.email === "" || loginData.password === "") {
    loginData.email = Cookies.get("email")
      ? JSON.parse(Cookies.get("email"))
      : "";
    loginData.password = Cookies.get("password")
      ? JSON.parse(Cookies.get("password"))
      : "";
  }

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(loginData));
    navigate("/home");
  };

  if (!Cookies.get("email") || !Cookies.get("password")) {
    return (
      <div className="auth">
        <div className="container customContainer">
          <div className="row h-100">
            <div className="col-12 text-center">
              <Link to="https://hefson.com/">
                <img className="logo" src={logoImg} alt="logo" />
              </Link>
            </div>

            <div className="col-12">
              <div className="content m-auto">
                <h2>Password Reset</h2>
                <p className="note mb-0">
                  Something went wrong, <strong>please try again!!</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth">
      <div className="container customContainer">
        <div className="row h-100">
          <div className="col-12 text-center">
            <img className="logo" src={logoImg} alt="logo" />
          </div>

          <div className="col-12">
            <div className="content m-auto">
              <h2>Password Reset</h2>
              <p className="note mb-0">
                Your password has been successfully reset.
              </p>
              <p className="note mb-0">Click below to sign in magically</p>
              <form action="" onSubmit={submitHandler}>
                <div className="row mt-30">
                  <div className="col-12">
                    <button className="btn btn-main w-100">CONTINUE</button>
                  </div>
                </div>
              </form>
              <p className=" mt-20 mb-0">
                <Link className="d-flex" to="/login">
                  <img src="./assets/icons/leftArrow.svg" alt="" /> Back to log
                  in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetConfirm;
