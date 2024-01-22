import * as api from "../api/index";

import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  GET_MAP_DATA,
  GET_MAP_DATA_DEVICE,
  GET_MAP_DATA_ERROR,
  GET_MAP_DATA_ERROR_DEVICE,
  GET_MAP_DATA_LOADING,
  GET_MAP_DATA_LOADING_DEVICE,
} from "../constants/mapData";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const listMapData = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_MAP_DATA_LOADING });
    const { data } = await api.fetchMapData(id);
    console.log("GET_MAP_DATA => ", data.data);
    dispatch({ type: GET_MAP_DATA, payload: data.data });
  } catch (error) {
    dispatch({ type: GET_MAP_DATA_ERROR });

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
export const listMapDataDevice = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_MAP_DATA_LOADING_DEVICE });
    const { data } = await api.fetchMapDataDevice(id); //
    console.log("GET_MAP_DATA_DEVICE => ", data.data);
    dispatch({ type: GET_MAP_DATA_DEVICE, payload: data.data });
  } catch (error) {
    dispatch({ type: GET_MAP_DATA_ERROR_DEVICE });

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
