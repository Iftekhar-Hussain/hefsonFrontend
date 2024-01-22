import HeaderComponent from "../components/Header/HeaderComponent";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import ToolBox from "./ToolBox";
import Cookies from "js-cookie";
import ToolBoxAdmin from "./ToolBoxAdmin";
import * as api from "../api/index";
import { toast } from "react-toastify";

const Settings = () => {
  const ref = useRef();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    currentpwd: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [field]: value,
    }));
  };

  const handleSubmitPasswords = async (e) => {
    e.preventDefault();

    if (Number(passwords.confirmPassword) !== Number(passwords.password)) {
      return toast("New password and confirm password do not match");
    }
    if (
      passwords.currentpwd === "" &&
      passwords.confirmPassword === "" &&
      passwords.password === ""
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        currentpwd: "Current password is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required.",
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Confirm password is required.",
      }));
      return;
    }

    const { confirmPassword, ...remainingPasswords } = passwords;
    setPasswords(remainingPasswords);

    try {
      const hasError = Object.values(errors).some((error) => error);

      if (!hasError) {
        const { data } = await api.changePassword({
          currentpwd: passwords.currentpwd,
          password: passwords.password,
        });
        toast(data.message);
      }
    } catch (error) {
      toast(error.response.data.message);
    }

    navigate("/login");
  };
  const [errors, setErrors] = useState({});

  const handleCurrentPasswordBlur = (e) => {
    const value = e.target.value.trim();
    if (value === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        currentpwd: "Current password is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        currentpwd: null,
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
        confirmPassword: "Confirm password is required.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: null,
      }));
    }
  };

  const [notificationSettings, setNotificationSettings] = useState({
    allowNotification: JSON.parse(Cookies.get("allowNotification")) || false,
    alertNotification: JSON.parse(Cookies.get("alertNotification")) || false,
    chatNotification: JSON.parse(Cookies.get("chatNotification")) || false,
    temperatureAlert: JSON.parse(Cookies.get("temperatureAlert")) || false,
  });

  const toggleNotification = (field) => {
    const newSettings = {
      ...notificationSettings,
      [field]: !notificationSettings[field],
    };

    setNotificationSettings(newSettings);
    Cookies.set(field, newSettings[field], { expires: 365 });
  };

  const handleSubmitNotifications = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.notificationSettings(notificationSettings);
      setNotificationSettings({
        allowNotification: JSON.parse(Cookies.get("allowNotification")),
        alertNotification: JSON.parse(Cookies.get("alertNotification")),
        chatNotification: JSON.parse(Cookies.get("chatNotification")),
        temperatureAlert: JSON.parse(Cookies.get("temperatureAlert")),
      });
      console.log("toggle result - ", notificationSettings);
      toast(data.message);
    } catch (error) {
      toast(error.response.data.message);
    }
  };

  return (
    <div className="Settings">
      <div className="container">
        <HeaderComponent />
        <div className="row">
          <div className="col">
            <ul class="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link active" data-bs-toggle="tab" href="#home">
                  Change Password
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#menu1">
                  Notification Settings
                </a>
              </li>
              {/* <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#menu2">
                  Random Images
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#menu3">
                  Terms & Conditions
                </a>
              </li> */}
            </ul>

            <div class="tab-content">
              <div class="tab-pane container active" id="home">
                <div className="row">
                  <div className="col-md-6 m-auto">
                    <h3 className="my-4">Change Password</h3>
                    <div className="contentBox">
                      <div className="inputField">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Current Password"
                          name="password"
                          required
                          onChange={(e) => {
                            handleChange("currentpwd", e.target.value);
                            handleCurrentPasswordBlur(e);
                          }}
                          onBlur={handleCurrentPasswordBlur}
                        />
                        <img src="./assets/icons/lock.svg" alt="" />
                      </div>
                      {errors.currentpwd && (
                        <h6 className="text-danger validation-error mt-2">
                          {errors.currentpwd}
                        </h6>
                      )}
                      <div className="inputField">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="New Password"
                          name="password"
                          required
                          onChange={(e) => {
                            handleChange("password", e.target.value);
                            handlePasswordBlur(e);
                          }}
                          onBlur={handlePasswordBlur}
                        />
                        <img src="./assets/icons/lock.svg" alt="" />
                      </div>
                      {errors.password && (
                        <h6 className="text-danger validation-error mt-2">
                          {errors.password}
                        </h6>
                      )}
                      <div className="inputField">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Confirm Password"
                          name="password"
                          required
                          onChange={(e) => {
                            handleChange("confirmPassword", e.target.value);
                            handleConfirmPasswordBlur(e);
                          }}
                          onBlur={handleConfirmPasswordBlur}
                        />
                        <img src="./assets/icons/lock.svg" alt="" />
                      </div>
                      {errors.confirmPassword && (
                        <h6 className="text-danger validation-error mt-2">
                          {errors.confirmPassword}
                        </h6>
                      )}
                      <div className="text-end">
                        <div
                          className="btn btn"
                          onClick={handleSubmitPasswords}
                        >
                          Change Password
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane container fade" id="menu1">
                <div className="row">
                  <div className="col-md-6 m-auto">
                    <h3 className="my-4">Notification Settings</h3>
                    <div className="contentBox">
                      <h3>Enable Notification</h3>

                      <div className="spaceBetween">
                        <h4>Allow Notification</h4>
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            checked={notificationSettings.allowNotification}
                            onChange={(e) => {
                              toggleNotification("allowNotification");
                              handleSubmitNotifications(e);
                            }}
                          />
                        </div>
                      </div>
                      <h3>Notification Types</h3>
                      <div className="spaceBetween">
                        <h4>Alert Notification </h4>
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            checked={notificationSettings.alertNotification}
                            onChange={(e) => {
                              toggleNotification("alertNotification");
                              handleSubmitNotifications(e);
                            }}
                          />
                        </div>
                      </div>
                      <hr />
                      <div className="spaceBetween">
                        <h4>Chat Notification</h4>
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            checked={notificationSettings.chatNotification}
                            onChange={(e) => {
                              toggleNotification("chatNotification");
                              handleSubmitNotifications(e);
                            }}
                          />
                        </div>
                      </div>
                      <hr />

                      <div className="spaceBetween">
                        <h4>Temperature Alert</h4>
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckChecked"
                            checked={notificationSettings.temperatureAlert}
                            onChange={(e) => {
                              toggleNotification("temperatureAlert");
                              handleSubmitNotifications(e);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane container fade" id="menu2">
                <div className="row">
                  <div className="col-md-9 m-auto">
                    <h3 className="my-4">Random Images</h3>
                    <div className="contentBox">
                      <div className="spaceBetween">
                        <h3>Dashboard</h3>
                        <Link data-bs-toggle="modal" data-bs-target="#addImage">
                          Add Images
                        </Link>
                      </div>
                      <div className="row">
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/dear.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/hippo.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/fox.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/trailerImage.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/deviceImage.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                      </div>
                      <div className="spaceBetween">
                        <h3>Trailers</h3>
                        <Link data-bs-toggle="modal" data-bs-target="#addImage">
                          Add Images
                        </Link>
                      </div>
                      <div className="row">
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/dear.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/hippo.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/fox.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/trailerImage.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/deviceImage.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                      </div>
                      <div className="spaceBetween">
                        <h3>Sensors</h3>
                        <Link data-bs-toggle="modal" data-bs-target="#addImage">
                          Add Images
                        </Link>
                      </div>
                      <div className="row">
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/dear.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/hippo.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/fox.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/trailerImage.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                        <div className="col-lg-2 col-md-4 col-6 m-auto">
                          <div className="imageBox">
                            <img src="./assets/deviceImage.png" alt="" />
                            <i class="fa-solid fa-circle-xmark"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane container fade" id="menu3">
                <div className="row">
                  <div className="col-md-10 m-auto">
                    <h3 className="my-4">Terms & Conditions</h3>
                    <div className="contentBox">
                      <h6>1. Lorem Ipsum is simply dummy</h6>
                      <p className="mb-0">
                        text of the printing and typesetting industry. Lorem
                        Ipsum has been the industry's standard dummy text ever
                        since the 1500s, when an unknown printer took a galley
                        of type and scrambled it to make a type specimen book.
                        It has survived not only five centuries, but also the
                        leap into electronic typesetting, remaining essentially
                        unchanged. It was popularised in the 1960s with the
                        release of Letraset sheets containing Lorem Ipsum
                        passages, and more recently with desktop publishing
                        software like Aldus PageMaker including versions of
                        Lorem Ipsum.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {JSON.parse(Cookies.get("role")) === 1 ? <ToolBoxAdmin /> : <ToolBox />}
      <div
        className="modal fade"
        id="addImage"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered custom-width">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add Images
              </h5>
              <button
                type="button"
                className="btn-closed"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-12">
                  <div className="inputField">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Random Time"
                      ref={ref}
                      onChange={(e) => console.log(e.target.value)}
                      onFocus={() => (ref.current.type = "date")}
                      onBlur={() => (ref.current.type = "text")}
                    />
                    <img
                      src="./assets/icons/CalendarDate.svg"
                      className="cal"
                      alt=""
                    />
                  </div>
                </div>

                <div className="col-12 mt-3">
                  <div className="inputField">
                    <label htmlFor="uploadFile" className="uploadImages">
                      Product Images
                      <input
                        type="file"
                        className="form-control"
                        placeholder="Product Images"
                        id="uploadFile"
                      />
                      <img
                        src="./assets/icons/Upload.svg"
                        className="cal"
                        alt=""
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-border ml-3"
                data-bs-dismiss="modal"
              >
                CANCEL
              </button>
              <button type="button" className="btn">
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
