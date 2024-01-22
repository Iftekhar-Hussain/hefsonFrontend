import * as api from "../api/index";

import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  LIST_DASHBOARD_SUCCESS,
  SET_DASHBOARD_LOADING,
  SET_DASHBOARD_LOADING_ERROR,
} from "../constants/dashboard";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const getDashboard = () => async (dispatch) => {
  try {
    dispatch({ type: SET_DASHBOARD_LOADING });
    const { data } = await api.getDashboard();
    console.log("LIST_DASHBOARD_SUCCESS => ", data.data);
    dispatch({ type: LIST_DASHBOARD_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_DASHBOARD_LOADING_ERROR });
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

    if (error.response) {
      return toast(error.response.data.message);
    }
  }
};
