import Cookie from "js-cookie";
import {
  END_TOKEN_REQUEST,
  RESET_PASSWORD,
  USER_FORGOT_PASSWORD,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_SIGNUP_FAIL,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  VERIFY_TOKEN_FAIL,
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
} from "../constants/user";
import * as api from "../api/index";
import { toast } from "react-toastify";

export const signup = (signupData) => async (dispatch) => {
  Object.keys(signupData).forEach((key) => {
    if (
      signupData[key] === "" ||
      signupData[key] === undefined ||
      signupData[key] === null
    ) {
      delete signupData[key];
    }
  });
  dispatch({ type: USER_SIGNUP_REQUEST, payload: signupData });

  try {
    const { data } = await api.signup(signupData);
    if (data.status === 400) {
      return toast(data.message);
    } else {
      toast(data.message);
      setTimeout(() => {
        dispatch({ type: USER_SIGNUP_SUCCESS, payload: data });
      }, 2000);
      window.location.replace("/send-code");
    }
  } catch (error) {
    dispatch({ type: USER_SIGNUP_FAIL, payload: error.message });
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      if (error.response || error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const login = (loginData) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST, payload: loginData });

  try {
    const { data } = await api.login(loginData);
    if (data.status === 400) {
      return toast(data.message);
    } else {
      toast(data.message);

      setTimeout(() => {
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      }, 3000);
      let userInfo = data.data;
      Cookie.set("loggedInUserId", JSON.stringify(userInfo._id));
      Cookie.set("loginToken", JSON.stringify(userInfo.loginToken));
      Cookie.set("role", JSON.stringify(userInfo.role));
      Cookie.set("email", JSON.stringify(userInfo.email));
      Cookie.set("fullName", JSON.stringify(userInfo.fullName));
      Cookie.set("businessName", JSON.stringify(userInfo.businessName));
      Cookie.set("phone", JSON.stringify(userInfo.phone));
      Cookie.set("image", JSON.stringify(userInfo.image));
      Cookie.set("allowNotification", userInfo.allowNotification);
      Cookie.set("alertNotification", userInfo.alertNotification);
      Cookie.set("chatNotification", userInfo.chatNotification);
      Cookie.set("temperatureAlert", userInfo.temperatureAlert);
      Cookie.set("shipmentNotifications", userInfo.shipmentNotifications);
      Cookie.set("generalNotification", userInfo.generalNotification);

      userInfo.role === 1
        ? window.location.replace("/admin-dashboard")
        : userInfo.role === 2
        ? window.location.replace("/home")
        : window.location.replace("/unauthorized");

      // window.location.replace("/home");
    }
  } catch (error) {
    dispatch({ type: USER_LOGIN_FAIL, payload: error.message });
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      if (error.response || error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const forgotPassword = (loginData) => async (dispatch) => {
  try {
    const { data } = await api.forgotPassword(loginData);
    if (data.status === 400) {
      return toast(data.message);
    } else {
      toast(data.message);
      setTimeout(() => {
        dispatch({ type: USER_FORGOT_PASSWORD, payload: data });
      }, 3000);
      Cookie.set("email", JSON.stringify(loginData.email));
      window.location.replace("/");
    }
  } catch (error) {
    console.log("USER_FORGOT_PASSWORD error => ", error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      if (error.response || error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const resetPassword = (loginData) => async (dispatch) => {
  try {
    const { data } = await api.resetPassword(loginData);
    if (data.status === 400) {
      return toast(data.message);
    } else {
      toast(data.message);
      setTimeout(() => {
        dispatch({ type: RESET_PASSWORD, payload: data });
      }, 3000);
      Cookie.set("password", JSON.stringify(loginData.password));
      window.location.replace("/reset-confirm");
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      if (error.response || error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const verifyToken = (tokenData) => async (dispatch) => {
  dispatch({ type: VERIFY_TOKEN_REQUEST });
  try {
    const { data } = await api.verifyToken(tokenData);
    if (data.status === 400) {
      return toast(data.message);
    } else {
      toast(data.message);
      setTimeout(() => {
        dispatch({ type: VERIFY_TOKEN_SUCCESS, payload: data.message });
      }, 2000);
      window.location.replace("/login");
    }
    // console.log("api data => ", data);
  } catch (error) {
    dispatch({ type: VERIFY_TOKEN_FAIL, payload: error.message });
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      if (error.response || error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const logout = () => async (dispatch) => {
  try {
    const { data } = await api.logout();
    if (data.status === 400) {
      return toast(data.message);
    } else {
      toast("Logout successfully");
      setTimeout(() => {
        dispatch({ type: USER_LOGOUT });
      }, 2000);
      Cookie.remove("loginToken");
      Cookie.remove("role");
      Cookie.remove("email");
      Cookie.remove("password");
      Cookie.remove("fullName");
    }
    // console.log("api data => ", data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      if (
        error.response.data.message ===
        "You are not an authorized user for this action."
      ) {
        Cookie.remove("loginToken");
        Cookie.remove("role");
        Cookie.remove("email");
        Cookie.remove("fullName");
        return toast("Login again");
      }

      if (error.response || error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};
