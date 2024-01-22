import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logoImg from "../../assets/Hefson_logo.svg";

import { forgotPassword, login } from "../../actions/user";

function ForgotPassword() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loginData, setLoginData] = useState({
    email: "",
  });

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    const hasError = Object.values(errors).some((error) => error);
    if (!hasError && loginData.email !== "") {
      dispatch(forgotPassword(loginData));
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
              <h2>Forgot Password?</h2>
              <p className="note">
                No worries, we'll send you reset instructions.
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
                        value={loginData.email}
                        onChange={(e) => {
                          handleEmailBlur(e);
                          setLoginData({ ...loginData, email: e.target.value });
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

                  <div className="col-12 mt-4">
                    <button className="btn btn-main w-100">
                      Reset password
                    </button>
                  </div>
                </div>
              </form>
              <p className=" mt-4 mb-0">
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

export default ForgotPassword;
