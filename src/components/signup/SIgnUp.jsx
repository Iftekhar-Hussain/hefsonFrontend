import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import logoImg from "../../assets/Hefson_logo.svg";

import { signup } from "../../actions/user";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
function SignUp() {
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    fullName: "",
    licenseNo: "",
    businessName: "",
    dotNumber: "",
    // isSoiltable: true,
  });
  const [hideSubmit, setHideSubmit] = useState(false);

  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const handleNameBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: "Name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: null,
      }));
    }
  };

  const handleBusinessNameBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        businessName: "Business Name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        businessName: null,
      }));
    }
  };

  const handleDotNumberBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dotNumber: "DOT Number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dotNumber: null,
      }));
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
    } else if (signupData.password !== value) {
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

  const handleRoleBlur = (e) => {
    const value = signupData.role;
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: "Role is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: null,
      }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("signup data  => ", signupData);
    if (hideSubmit === false) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        flexCheckDefault: "Please select terms & condition",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        flexCheckDefault: null,
      }));
    }

    if (signupData.email === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }

    if (signupData.role === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: "Role is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: "",
      }));
    }

    if (signupData.fullName === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: "Full name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullName: "",
      }));
    }

    if (signupData.businessName === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        businessName: "Business name is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        businessName: "",
      }));
    }

    if (signupData.dotNumber === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dotNumber: "DOT number is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        dotNumber: "",
      }));
    }
    if (signupData.password === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
      }));
    }
    if (signupData.confirmPassword === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Confirm password is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "",
      }));
    }

    const hasError = Object.values(errors).some((error) => error);

    if (!hasError && signupData.email !== "" && signupData.role !== "") {
      delete signupData.confirmPassword;
      Cookies.set("userEmail", JSON.stringify(signupData.email));
      dispatch(signup(signupData));
    }
  };

  // const setRole = (value) => {
  //   let roleValue = parseInt(value);

  //   setSignupData({
  //     ...signupData,
  //     role: roleValue,
  //   });
  // };

  const options = [
    {
      label: "CARRIER",
      value: 2,
    },
    {
      label: "BROKER",
      value: 3,
    },
    {
      label: "COMPANY(shipper/reciever)",
      value: 5,
    },
  ];

  // setting selected option for dropdown
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChangeOptions = (selectedOption) => {
    setSelectedOption(selectedOption);
    // Update driverData with selected value
    const selectedValue = selectedOption ? selectedOption.value : "";
    // ...
    setSignupData({
      ...signupData,
      role: selectedValue,
    });

    if (signupData.role === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: "Role is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: "",
      }));
    }
  };
  let value = null;
  if (signupData.role === "") {
    value = { value: "", label: "Select Role" }; // Set custom placeholder option
  } else {
    value = options.find((option) => option.value === signupData.role);
  }
  // dropdown value

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
              <h2>Sign Up</h2>
              <p className="note">
                Enter your details for creating account. Thanks
              </p>
              <form action="" onSubmit={submitHandler}>
                <div className="row">
                  <div className="col-12 ">
                    <div className="inputField">
                      <Select
                        value={selectedOption || value}
                        onChange={handleChangeOptions}
                        options={options}
                        placeholder="Select Role"
                        onBlur={handleRoleBlur}
                      />
                    </div>
                    {errors.role && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.role}
                      </h6>
                    )}
                  </div>
                  <div className="col-12 mt-25">
                    <div className="inputField">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        name="fullName"
                        value={signupData.fullName}
                        onChange={(e) => {
                          handleNameBlur(e);
                          setSignupData({
                            ...signupData,
                            fullName: e.target.value,
                          });
                        }}
                        onBlur={(e) => handleNameBlur(e)}
                      />
                      <i className="fa-solid fa-user"></i>
                    </div>
                    {errors.fullName && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.fullName}
                      </h6>
                    )}
                  </div>

                  {signupData.role === 4 ? (
                    <div className="col-12 mt-25">
                      <div className="inputField">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="License number"
                          value={signupData.licenseNo}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              licenseNo: e.target.value,
                            })
                          }
                        />
                        <i className="fa-solid fa-hashtag"></i>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="col-12 mt-25">
                        <div className="inputField">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Company / Business Name"
                            value={signupData.businessName}
                            name="businessName"
                            onChange={(e) => {
                              handleBusinessNameBlur(e);
                              setSignupData({
                                ...signupData,
                                businessName: e.target.value,
                              });
                            }}
                            onBlur={(e) => handleBusinessNameBlur(e)}
                          />
                          <i className="fa-solid fa-building"></i>
                        </div>
                        {errors.businessName && (
                          <h6 className="text-danger validation-error mt-2">
                            {errors.businessName}
                          </h6>
                        )}
                      </div>
                      <div className="col-12 mt-25">
                        <div className="inputField">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="DOT number"
                            value={signupData.dotNumber}
                            onChange={(e) => {
                              handleDotNumberBlur(e);
                              setSignupData({
                                ...signupData,
                                dotNumber: e.target.value,
                              });
                            }}
                            onBlur={(e) => handleDotNumberBlur(e)}
                          />
                          <i className="fa-solid fa-hashtag"></i>
                        </div>
                        {errors.dotNumber && (
                          <h6 className="text-danger validation-error mt-2">
                            {errors.dotNumber}
                          </h6>
                        )}
                      </div>
                    </>
                  )}

                  <div className="col-12 mt-25">
                    <div className="inputField">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                        value={signupData.email}
                        name="email"
                        onChange={(e) => {
                          handleEmailBlur(e);
                          setSignupData({
                            ...signupData,
                            email: e.target.value,
                          });
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
                        value={signupData.password}
                        onChange={(e) => {
                          handlePasswordBlur(e);
                          setSignupData({
                            ...signupData,
                            password: e.target.value,
                          });
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
                  <div className="col-12 mt-25">
                    <div className="inputField">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={signupData.confirmPassword}
                        onChange={(e) => {
                          handleConfirmPasswordBlur(e);
                          setSignupData({
                            ...signupData,
                            confirmPassword: e.target.value,
                          });
                        }}
                        onBlur={(e) => handleConfirmPasswordBlur(e)}
                      />
                      <img src="./assets/icons/lock.svg" alt="" />
                    </div>
                    {errors.confirmPassword && (
                      <h6 className="text-danger validation-error mt-2">
                        {errors.confirmPassword}
                      </h6>
                    )}
                  </div>
                  <div className="col-12 mt-15">
                    <div className="spaceBetween">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="flexCheckDefault"
                          onChange={(event) =>
                            setHideSubmit(event.currentTarget.checked)
                          }
                          checked={hideSubmit}
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          I accept Hefson’s{" "}
                          <a href="/terms-and-condition" target="_blank">
                            Terms of Use
                          </a>
                        </label>
                      </div>
                      {errors.flexCheckDefault && (
                        <h6 className="text-danger validation-error mt-2">
                          {errors.flexCheckDefault}
                        </h6>
                      )}
                    </div>
                  </div>

                  <div className="col-12 mt-20">
                    <button
                      className="btn btn-main w-100"
                      type="submit"
                      disabled={hideSubmit === false ? true : false}
                    >
                      SIGN UP
                    </button>
                  </div>
                </div>
              </form>
              <p className=" mt-4 mb-0">
                Already have an account? <Link to="/login">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
