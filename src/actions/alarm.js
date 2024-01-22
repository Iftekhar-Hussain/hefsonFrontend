import * as api from "../api/index";
import {
  LIST_ALARM_PAST_SUCCESS,
  LIST_ALARM_SUCCESS,
  SET_ALARM_LOADING_ERROR,
} from "../constants/alarm";

import Cookies from "js-cookie";
import { toast } from "react-toastify";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const listAlarm = (page, limit, status) => async (dispatch) => {
  try {
    const { data } = await api.fetchAlarms(page, limit, status);
    console.log("LIST_ALARM_SUCCESS => ", data.data);
    dispatch({ type: LIST_ALARM_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_ALARM_LOADING_ERROR });
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

export const listAlarmPast = (page, limit, status) => async (dispatch) => {
  try {
    const { data } = await api.fetchAlarms(page, limit, status);
    console.log("LIST_ALARM_PAST_SUCCESS => ", data.data);
    dispatch({ type: LIST_ALARM_PAST_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_ALARM_LOADING_ERROR });
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
