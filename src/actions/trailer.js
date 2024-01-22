import * as api from "../api/index";
import {
  CREATE_TRAILER_SUCCESS,
  DELETE_TRAILER_SUCCESS,
  LIST_TRAILER_DETAIL_SUCCESS,
  LIST_TRAILER_SUCCESS,
  LIST_TRAILER_SUCCESS_SEARCH,
  SET_TRAILER_LOADING,
  SET_TRAILER_LOADING_ERROR,
  TRAILER_CHECKBOX_UPDATE,
  UPDATE_TRAILER_DETAIL_SUCCESS,
  UPDATE_TRAILER_SUCCESS,
} from "../constants/trailer";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const deleteTrailer = (id) => async (dispatch) => {
  try {
    await api.deleteTrailer(id);
    dispatch({ type: DELETE_TRAILER_SUCCESS, payload: id });
    // toast("Trailer deleted successfully");
  } catch (error) {
    dispatch({ type: SET_TRAILER_LOADING_ERROR });

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
      return toast(error.response.data.message);
    }
    if (error.response) {
      if (error.response && error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const updateTrailer = (id, updatedData) => async (dispatch) => {
  try {
    console.log(".........", id);
    const { data } = await api.updateTrailer(id, updatedData);
    console.log("UPDATE_Trailer_SUCCESS => ", data.data);
    const sendData = await api.getTrailerDetail(data.data._id);
    console.log("DETail_TRUCK_SUCCESS => ", sendData);

    dispatch({ type: UPDATE_TRAILER_SUCCESS, payload: sendData.data.data[0] });
    toast(data.message);
  } catch (error) {
    dispatch({ type: SET_TRAILER_LOADING_ERROR });

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

export const updateCheckbox = (dataId, checked) => async (dispatch) => {
  try {
    dispatch({ type: SET_TRAILER_LOADING });

    const { data } = await api.updateCheckboxTrailer(dataId, checked);
    // console.log("DRIVER_CHECKBOX_UPDATE => ", data.data._id);

    const sendData = await api.getTrailerDetail(data.data._id);

    // console.log("DRIVER_CHECKBOX_UPDATE => ", sendData);

    dispatch({ type: TRAILER_CHECKBOX_UPDATE, payload: sendData.data.data[0] });
  } catch (error) {
    dispatch({ type: SET_TRAILER_LOADING_ERROR });

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

export const list = (page, limit) => async (dispatch) => {
  try {
    // if (loginToken === null) {
    //   window.location.replace("/login");
    // }
    dispatch({ type: SET_TRAILER_LOADING });
    const { data } = await api.fetchTrailers(page, limit);
    console.log("LIST_Trailer_SUCCESS => ", data.data);
    dispatch({ type: LIST_TRAILER_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_TRAILER_LOADING_ERROR });

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

export const listSearch = (page, limit, search) => async (dispatch) => {
  try {
    dispatch({ type: SET_TRAILER_LOADING });
    const { data } = await api.fetchTrailerSearch(page, limit, search);
    console.log("LIST_Trailer_SUCCESS search => ", data.data);
    dispatch({ type: LIST_TRAILER_SUCCESS_SEARCH, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_TRAILER_LOADING_ERROR });

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

export const listTrailer = (page, limit) => async (dispatch) => {
  try {
    // if (loginToken === null) {
    //   window.location.replace("/login");
    // }
    const { data } = await api.fetchTrailers(page, limit);
    console.log("LIST_Trailer_SUCCESS => ", data.data);
    dispatch({ type: LIST_TRAILER_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_TRAILER_LOADING_ERROR });

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

export const createTrailer = (TrailerData) => async (dispatch) => {
  try {
    const { data } = await api.createTrailer(TrailerData);
    console.log("CREATE_Trailer_SUCCESS => ", data.data);
    const sendData = await api.getTrailerDetail(data.data._id);
    console.log("DETail_TRUCK_SUCCESS => ", sendData);

    dispatch({ type: CREATE_TRAILER_SUCCESS, payload: sendData.data.data[0] });
    toast(data.message);
  } catch (error) {
    dispatch({ type: SET_TRAILER_LOADING_ERROR });

    console.log(error);
    // if (error.response.status === 400) {
    //   window.location.replace("/login");
    // }
    if (error.response) {
      if (error.response && error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const detailTrailer = (id) => async (dispatch) => {
  try {
    dispatch({ type: SET_TRAILER_LOADING });
    const { data } = await api.getTrailerDetail(id);
    console.log("LIST_TRAILER_DETAIL_SUCCESS => ", data.data[0]);
    dispatch({ type: LIST_TRAILER_DETAIL_SUCCESS, payload: data.data[0] });
  } catch (error) {
    dispatch({ type: SET_TRAILER_LOADING_ERROR });

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

export const createEvent = (id, eventData) => async (dispatch) => {
  try {
    const { data } = await api.createEvent(id, eventData);
    console.log("UPDATE_TRAILER_DETAIL_SUCCESS => ", data.data);
    const sendData = await api.getTrailerDetail(data.data._id);
    console.log("UPDATE_TRAILER_DETAIL_SUCCESS 2 => ", sendData);

    dispatch({
      type: UPDATE_TRAILER_DETAIL_SUCCESS,
      payload: sendData.data.data[0],
    });
    toast(data.message);
  } catch (error) {
    dispatch({ type: SET_TRAILER_LOADING_ERROR });

    console.log(error);

    if (error.response) {
      if (error.response && error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const resetHour = (id, resetHours) => async (dispatch) => {
  try {
    const { data } = await api.updateTrailerHour(id, resetHours);
    console.log("UPDATE_TRAILER_DETAIL_SUCCESS => ", data.data);
    const sendData = await api.getTrailerDetail(id);
    console.log("UPDATE_TRAILER_DETAIL_SUCCESS 2 => ", sendData);

    dispatch({
      type: UPDATE_TRAILER_DETAIL_SUCCESS,
      payload: sendData.data.data[0],
    });
    toast(data.message);
  } catch (error) {
    dispatch({ type: SET_TRAILER_LOADING_ERROR });

    console.log(error);

    if (error.response) {
      if (error.response && error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};
