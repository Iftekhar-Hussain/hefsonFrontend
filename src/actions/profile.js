import * as api from "../api/index";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  GET_USER_PROFILE_FAIL,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_SUCCESS
} from "../constants/profile";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const detailProfile = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_PROFILE_REQUEST });
    const { data } = await api.getProfileDetail();
    console.log("GET_USER_PROFILE_SUCCESS => ", data.data);
    dispatch({ type: GET_USER_PROFILE_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: GET_USER_PROFILE_FAIL });

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      if (loginToken === null) {
        window.location.replace("/login");
      }
      if (error.response && error.response.status === 429) {
        return toast(error.response.data.message + ", please reload");
      }
      if (
        error.response &&
        error.response.data.message === "Request failed with status code 429"
      ) {
        return toast(error.response.data.message + ", please reload");
      }
      if (
        error.response &&
        error.response.data.message ===
          "You are not an authorized user for this action."
      ) {
        window.location.replace("/login");
      }
      if (error.response && error.response.status === 400) {
        return toast(error.response.data.message + ", please reload");
      }
      console.log("error.response => ", error.response);
      console.log("error.response.status=> ", error.response.status);
      console.log("error.response.headers=> ", error.response.headers);
      console.log("error.response.message => ", error.response.message);
      console.log(
        "error.response.data.message => ",
        error.response.data.message
      );
      return toast(error.response.data.message);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("error.request => ", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("error.message on driver action => ", error.message);
    }
  }
};

export const updateProfile = (updatedData) => async (dispatch) => {
  try {
    console.log(updatedData, "NO")
    const { data } = await api.updateProfile(updatedData);
    console.log("UPDATE_USER_PROFILE_SUCCESS => ", data.data);
    const sendData = await api.getProfileDetail();
    console.log("UPDATE_USER_PROFILE_SUCCESS gwet => ", sendData.data.data);

    dispatch({ type: UPDATE_USER_PROFILE_SUCCESS, payload: sendData.data.data });
    toast(data.message);
  } catch (error) {
    console.log(error);
    if (loginToken === null) {
      window.location.replace("/login");
    }
    if (
      error.response &&
      error.response.data.message ===
        "You are not an authorized user for this action."
    ) {
      window.location.replace("/login");
    }
    if (error.response && error.response.status === 400) {
      return toast(error.response.data.message);
    }
    if (error.response) {
      if (error.response && error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};
