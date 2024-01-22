import * as api from "../api/index";

import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  LIST_NOTIFICATIONS_SUCCESS,
  SET_NOTIFICATIONS_LOADING_ERROR,
} from "../constants/notifications";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const listNotifications = (page, limit) => async (dispatch) => {
  try {
    const { data } = await api.listNotifications(page, limit);
    console.log("LIST_NOTIFICATIONS_SUCCESS => ", data);
    dispatch({ type: LIST_NOTIFICATIONS_SUCCESS, payload: data?.data });
  } catch (error) {
    dispatch({ type: SET_NOTIFICATIONS_LOADING_ERROR });
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
