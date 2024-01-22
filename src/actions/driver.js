import * as api from "../api/index";
import {
  CREATE_DRIVER_SUCCESS,
  DELETE_DRIVER_SUCCESS,
  DRIVER_CHECKBOX_UPDATE,
  LIST_DRIVER_SUCCESS,
  LIST_DRIVER_SUCCESS_SEARCH,
  SET_DRIVER_LOADING_ERROR,
  UPDATE_DRIVER_SUCCESS,
} from "../constants/driver";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const deleteDriver = (id) => async (dispatch) => {
  try {
    await api.deleteDriver(id);
    dispatch({ type: DELETE_DRIVER_SUCCESS, payload: id });
    // toast("User deleted successfully");
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
      return toast(error.response.data.message);
    }
    if (error.response) {
      if (error.response && error.response.status === 400) {
        return toast(error.response.data.message);
      }
    }
  }
};

export const updateDriver = (id, updatedData) => async (dispatch) => {
  try {
    const { data } = await api.updateDriver(id, updatedData);
    console.log("UPDATE_CUSTOMER_SUCCESS => ", data);
    const sendData = await api.getDriverDetail(data.data._id);
    console.log("UPDATE_CUSTOMER_SUCCESS dd => ", sendData);

    dispatch({ type: UPDATE_DRIVER_SUCCESS, payload: sendData.data.data[0] });
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

export const updateCheckbox = (dataId, checked) => async (dispatch) => {
  try {
    const { data } = await api.updateCheckboxDriver(dataId, checked);
    // console.log("DRIVER_CHECKBOX_UPDATE => ", data.data._id);

    const sendData = await api.getDriverDetail(data.data._id);

    // console.log("DRIVER_CHECKBOX_UPDATE => ", sendData);

    dispatch({ type: DRIVER_CHECKBOX_UPDATE, payload: sendData.data.data[0] });
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

export const list = (page, limit, sortBy, sortValue) => async (dispatch) => {
  try {
    const { data } = await api.fetchDrivers(page, limit, sortBy, sortValue);
    console.log("LIST_DRIVERS_SUCCESS => ", data.data);
    dispatch({ type: LIST_DRIVER_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_DRIVER_LOADING_ERROR });
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
          window.location.replace("/login");
        } else {
          window.location.replace("/login");
        }
      }
      return error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.log("error.request => ", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("error.message on driver action => ", error.message);
    }
  }
};
export const listSearch =
  (page, limit, sortBy, sortValue, search) => async (dispatch) => {
    try {
      const { data } = await api.fetchDriverSearch(
        page,
        limit,
        sortBy,
        sortValue,
        search
      );
      console.log("LIST_DRIVER_SUCCESS_SEARCH => ", data.data);
      dispatch({ type: LIST_DRIVER_SUCCESS_SEARCH, payload: data.data });
    } catch (error) {
      dispatch({ type: SET_DRIVER_LOADING_ERROR });
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
            window.location.replace("/login");
          } else {
            window.location.replace("/login");
          }
        }
        return error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        console.log("error.request => ", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("error.message on driver action => ", error.message);
      }
    }
  };

export const listDriver =
  (page, limit, sortBy, sortValue) => async (dispatch) => {
    try {
      const { data } = await api.fetchDrivers(page, limit, sortBy, sortValue);
      console.log("LIST_DRIVERS_SUCCESS => ", data.data);
      dispatch({ type: LIST_DRIVER_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: SET_DRIVER_LOADING_ERROR });
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
            window.location.replace("/login");
          } else {
            window.location.replace("/login");
          }
        }
        return error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        console.log("error.request => ", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("error.message on driver action => ", error.message);
      }
    }
  };

export const createDriver = (driverData) => async (dispatch) => {
  try {
    const { data } = await api.createDriver(driverData);
    console.log("CREATE_TRUCK_SUCCESS => ", data);
    const sendData = await api.getDriverDetail(data.data._id);
    console.log("CREATE_TRUCK_SUCCESS => ", sendData);

    dispatch({ type: CREATE_DRIVER_SUCCESS, payload: sendData.data.data[0] });
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
