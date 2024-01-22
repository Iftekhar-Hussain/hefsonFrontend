import * as api from "../api/index";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  APPROVE_SOILTABLE_SUCCESS,
  LIST_SOILTABLE_SUCCESS,
  SET_SOILTABLE_ERROR,
  SET_SOILTABLE_LOADING,
  UPDATE_SOILTABLE_SUCCESS,
} from "../constants/soiltable";
import { LIST_SOILTABLE_DETAIL_SUCCESS } from "../constants/soiltableCategory";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const listSoiltable = (page, limit, categoryId) => async (dispatch) => {
  try {
    dispatch({ type: SET_SOILTABLE_LOADING });
    const { data } = await api.fetchSoiltable(page, limit, categoryId);
    console.log("LIST_SOILTABLE_SUCCESS => ", data.data.data);
    dispatch({
      type: LIST_SOILTABLE_SUCCESS,
      payload: data.data.data,
    });
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      dispatch({ type: SET_SOILTABLE_ERROR });
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

export const editSoiltableProduct = (updatedData) => async (dispatch) => {
  try {
    console.log("updatedData -- ", updatedData);

    const { data } = await api.editSoiltableProduct(updatedData);
    console.log("response data => ", data?.data);

    dispatch({
      type: UPDATE_SOILTABLE_SUCCESS,
      payload: data?.data,
    });

    toast(data.message);
  } catch (error) {
    dispatch({ type: SET_SOILTABLE_ERROR });

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

export const approveSoiltableProduct =
  (dataId, checked) => async (dispatch) => {
    try {
      const { data } = await api.approveSoiltableProduct(dataId, checked);
      console.log("UPDATE_SOILTABLE_SUCCESS data => ", data?.data);

      dispatch({
        type: APPROVE_SOILTABLE_SUCCESS,
        payload: data?.data,
      });

      // toast(data.message);
    } catch (error) {
      dispatch({ type: SET_SOILTABLE_ERROR });

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

export const detailSoiltable = (id) => async (dispatch) => {
  try {
    dispatch({ type: SET_SOILTABLE_LOADING });
    const { data } = await api.getSoiltableDetail(id);
    console.log("LIST_SOILTABLE_DETAIL_SUCCESS => ", data.data);
    dispatch({ type: LIST_SOILTABLE_DETAIL_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_SOILTABLE_ERROR });

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

export const createSoiltableProduct =
  (id, shipmentData) => async (dispatch) => {
    try {
      const { data } = await api.createSoiltableTimeline(id, shipmentData);
      console.log("createSoiltableProduct => ", data);
      // console.log("ddddddddnnnnf", data.data._id);

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
        return toast(error.response.data.message + ", please reload");
      }
      if (error.response) {
        if (error.response && error.response.status === 400) {
          return toast(error.response.data.message);
        }
      }
    }
  };
