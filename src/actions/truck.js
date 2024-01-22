import * as api from "../api/index";

import Cookies from "js-cookie";
import {
  CREATE_TRUCK_SUCCESS,
  DELETE_TRUCK_SUCCESS,
  LIST_TRUCK_SUCCESS,
  LIST_TRUCK_SUCCESS_SEARCH,
  SET_TRUCK_LOADING,
  SET_TRUCK_LOADING_ERROR,
  TRUCK_CHECKBOX_UPDATE,
  UPDATE_TRUCK_SUCCESS,
} from "../constants/truck";
import { toast } from "react-toastify";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const updateCheckbox = (dataId, checked) => async (dispatch) => {
  try {
    const { data } = await api.updateCheckbox(dataId, checked);
    console.log("TRUCK_CHECKBOX_UPDATE => ", data.data._id);
    let sendData = null;
    sendData = await api.getUnitDetail(data.data._id);
    // console.log("data  --- ", sendData.data.data.length)
    // console.log("TRUCK_CHECKBOX_UPDATE => ", sendData);

    if (sendData.data.data.length === 0) {
      // window.location.reload();
    }
    console.log("TRUCK_CHECKBOX_UPDATE => ", sendData);

    dispatch({ type: TRUCK_CHECKBOX_UPDATE, payload: sendData.data.data[0] });
    // toast(data.message);
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

export const deleteUnit = (id) => async (dispatch) => {
  try {
    const { data } = await api.deleteUnit(id);
    console.log("deleted data wwwwww ");
    dispatch({ type: DELETE_TRUCK_SUCCESS, payload: id });
    // toast(data.message);
  } catch (error) {
    console.log(error.message);
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

export const update = (id, updatedData) => async (dispatch) => {
  try {
    const { data } = await api.updateUnits(id, updatedData);
    console.log("UPDATE_TRUCK_SUCCESS data => ", data.data._id);
    const sendData = await api.getUnitDetail(data.data._id);
    console.log("UPDATE_TRUCK_SUCCESS => ", sendData.data.data[0]);
    dispatch({ type: UPDATE_TRUCK_SUCCESS, payload: sendData.data.data[0] });
    toast(data.message);
  } catch (error) {
    dispatch({ type: SET_TRUCK_LOADING_ERROR });
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
    const { data } = await api.fetchUnits(page, limit);
    console.log("LIST_UNIT_SUCCESS => ", data.data);
    dispatch({ type: LIST_TRUCK_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_TRUCK_LOADING_ERROR });
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

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
      console.log("error.response => ", error.response);
      console.log("error.response.status=> ", error.response.status);
      console.log("error.response.headers=> ", error.response.headers);
      console.log("error.response.message => ", error.response.message);
      console.log(
        "error.response.data.message => ",
        error.response.data.message
      );
      if (error.response && error.response.status === 401) {
        // handle unauthorized error
        if (error.response.data.message === "Session Expired.") {
          Cookies.remove("loginToken");
          Cookies.remove("role");
          Cookies.remove("email");
          Cookies.remove("fullName");
          toast(error.response.data.message);
          window.location.replace("/login");

          // window.location.reload();
        } else {
          Cookies.remove("loginToken");
          Cookies.remove("role");
          Cookies.remove("email");
          Cookies.remove("fullName");
          toast(error.response.data.message);
          window.location.replace("/login");
          // window.location.reload();
        }
      }
      return;
      // return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.log("error.request => ", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("error.message=> ", error.message);
    }
  }
};

export const listTruckSearch = (page, limit, search) => async (dispatch) => {
  try {
    const { data } = await api.fetchUnitsSearch(page, limit, search);
    console.log("LIST_UNIT_SUCCESS => ", data.data);
    dispatch({ type: LIST_TRUCK_SUCCESS_SEARCH, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_TRUCK_LOADING_ERROR });
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

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
      console.log("error.response => ", error.response);
      console.log("error.response.status=> ", error.response.status);
      console.log("error.response.headers=> ", error.response.headers);
      console.log("error.response.message => ", error.response.message);
      console.log(
        "error.response.data.message => ",
        error.response.data.message
      );
      if (error.response && error.response.status === 401) {
        // handle unauthorized error
        if (error.response.data.message === "Session Expired.") {
          Cookies.remove("loginToken");
          Cookies.remove("role");
          Cookies.remove("email");
          Cookies.remove("fullName");
          toast(error.response.data.message);
          window.location.replace("/login");

          // window.location.reload();
        } else {
          Cookies.remove("loginToken");
          Cookies.remove("role");
          Cookies.remove("email");
          Cookies.remove("fullName");
          toast(error.response.data.message);
          window.location.replace("/login");
          // window.location.reload();
        }
      }
      return;
      // return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.log("error.request => ", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("error.message=> ", error.message);
    }
  }
};

export const listTruck = (page, limit) => async (dispatch) => {
  try {
    const { data } = await api.fetchUnits(page, limit);
    console.log("LIST_UNIT_SUCCESS => ", data.data);
    dispatch({ type: LIST_TRUCK_SUCCESS, payload: data.data });
  } catch (error) {
    if (error.response) {
      dispatch({ type: SET_TRUCK_LOADING_ERROR });

      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

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
      console.log("error.response => ", error.response);
      console.log("error.response.status=> ", error.response.status);
      console.log("error.response.headers=> ", error.response.headers);
      console.log("error.response.message => ", error.response.message);
      console.log(
        "error.response.data.message => ",
        error.response.data.message
      );
      if (error.response && error.response.status === 401) {
        // handle unauthorized error
        if (error.response.data.message === "Session Expired.") {
          Cookies.remove("loginToken");
          Cookies.remove("role");
          Cookies.remove("email");
          Cookies.remove("fullName");
          toast(error.response.data.message);
          window.location.replace("/login");

          // window.location.reload();
        } else {
          Cookies.remove("loginToken");
          Cookies.remove("role");
          Cookies.remove("email");
          Cookies.remove("fullName");
          toast(error.response.data.message);
          window.location.replace("/login");
          // window.location.reload();
        }
      }
      return;
      // return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.log("error.request => ", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("error.message=> ", error.message);
    }
  }
};

export const createUnit = (unitData) => async (dispatch) => {
  try {
    const { data } = await api.createUnit(unitData);
    console.log("CREATE_TRUCK_SUCCESS => ", data.data._id);
    const sendData = await api.getUnitDetail(data.data._id);
    console.log("CREATE_TRUCK_SUCCESS => ", sendData.data.data[0]);

    dispatch({ type: CREATE_TRUCK_SUCCESS, payload: sendData.data.data[0] });
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
