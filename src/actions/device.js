import * as api from "../api/index";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  ASSIGN_DEVICE_SUCCESS,
  LIST_DEVICE_SUCCESS,
  SET_DEVICE_LOADING_ERROR,
} from "../constants/device";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const list = (page, limit) => async (dispatch) => {
  try {
    const { data } = await api.fetchDivices(page, limit);
    console.log("LIST_DEVICE_SUCCESS => ", data.data);
    dispatch({ type: LIST_DEVICE_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_DEVICE_LOADING_ERROR });
    console.log(error.message);
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
      return toast(error.response.data.message + ", please reload");
    }
    if (error.response) {
      if (error.response && error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const listSearchDevice = (page, limit, search) => async (dispatch) => {
  try {
    const { data } = await api.fetchSearchDevices(page, limit, search);
    console.log("LIST_DEVICE_SUCCESS => ", data.data);
    dispatch({ type: LIST_DEVICE_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_DEVICE_LOADING_ERROR });
    console.log(error.message);
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
      return toast(error.response.data.message + ", please reload");
    }
    if (error.response) {
      if (error.response && error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const listDevice = (page, limit) => async (dispatch) => {
  try {
    const { data } = await api.fetchDivices(page, limit);
    console.log("LIST_DEVICE_SUCCESS => ", data.data);
    dispatch({ type: LIST_DEVICE_SUCCESS, payload: data.data });
  } catch (error) {
    console.log(error.message);
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
      return toast(error.response.data.message + ", please reload");
    }
    if (error.response) {
      if (error.response && error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const assignDevice = (id, updatedData) => async (dispatch) => {
  try {
    const { data } = await api.assignDevice(updatedData);
    console.log("ASSIGN_DEVICE_SUCCESS  => ", data);
    const sendData = await api.getDeviceDetail(id);
    console.log("ASSIGN_DEVICE_SUCCESS detail => ", sendData);

    dispatch({ type: ASSIGN_DEVICE_SUCCESS, payload: sendData.data.data[0] });
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
