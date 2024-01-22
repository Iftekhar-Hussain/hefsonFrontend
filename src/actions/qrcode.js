import * as api from "../api/index";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import {
  LIST_QRCODE_SUCCESS,
  SET_QRCODE_ERROR,
  SET_QRCODE_LOADING,
} from "../constants/qrcode";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const listQrcode = (page, limit, categoryId) => async (dispatch) => {
  try {
    dispatch({ type: SET_QRCODE_LOADING });
    const { data } = await api.fetchSoiltable(page, limit, categoryId);
    console.log("LIST_QRCODE_SUCCESS => ", data);
    dispatch({
      type: LIST_QRCODE_SUCCESS,
      payload: data.data,
    });
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      dispatch({ type: SET_QRCODE_ERROR });
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
      console.log(
        "error.message on soiltable category action => ",
        error.message
      );
    }
  }
};
