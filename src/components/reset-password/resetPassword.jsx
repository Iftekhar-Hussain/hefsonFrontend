import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import logoImg from "../../assets/Hefson_logo.svg";

import { resetPassword } from "../../actions/user";
import { toast } from "react-toastify";
function ResetPassword() {
  const { token } = useParams();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    loginData.token = token;
    const hasError = Object.values(errors).some((error) => error);

    if (!hasError) {
      dispatch(
        resetPassword({
          token: token,
          password: loginData.password,
        })
      );
    }
  };

  const handlePasswordBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required.",
      }));
    } else if (value.length <= 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password length must be greater than 6",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: null,
      }));
    }
  };

  const handleConfirmPasswordBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Confirm Password is required.",
      }));
    } else if (loginData.password !== value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Entered password and confirm password does not match",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: null,
      }));
    }
  };

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
              <h2>Set New Password</h2>
              <p className="note">
                Your new password must be different to previously used
                passwords.
              </p>
              <form action="" onSubmit={submitHandler}>
                <div className="row">
                  <div className="col-12">
                    <div className="inputField">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        name="password"
                        value={loginData.password}
                        onChange={(e) => {
                          handlePasswordBlur(e);
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          });
                        }}
                        onBlur={(e) => handlePasswordBlur(e)}
                      />
                      <img src="../assets/icons/lock.svg" alt="" />
                    </div>
                    {errors.password && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.password}
                      </h6>
                    )}
                  </div>
                  <div className="col-12 mt-25">
                    <div className="inputField">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={loginData.confirmPassword}
                        onChange={(e) => {
                          handleConfirmPasswordBlur(e);
                          setLoginData({
                            ...loginData,
                            confirmPassword: e.target.value,
                          });
                        }}
                        onBlur={(e) => handleConfirmPasswordBlur(e)}
                      />
                      <img src="../assets/icons/lock.svg" alt="" />
                    </div>
                    {errors.confirmPassword && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.confirmPassword}
                      </h6>
                    )}
                  </div>

                  <div className="col-12 mt-30">
                    <button className="btn btn-main w-100">
                      RESET PASSWORD
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
