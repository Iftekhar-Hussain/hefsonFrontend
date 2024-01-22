import * as api from "../api/index";
import {
  CLEAR_ACTIVE_CHAT_SUCCESS,
  LIST_ACTIVE_CHAT_SUCCESS,
  LIST_CHAT_SUCCESS,
  SET_CHAT_LOADING,
  SET_CHAT_LOADING_ERROR,
  SET_MESSAGE_LOADING,
  SET_MESSAGE_LOADING_ERROR,
  LIST_CUSTOMER_CHAT_SUCCESS_SEARCH,
} from "../constants/chat";

import Cookies from "js-cookie";
import { toast } from "react-toastify";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const listSearchChatCustomer =
  (page, limit, search) => async (dispatch) => {
    try {
      const { data } = await api.fetchSearchUserNGroup(page, limit, search);
      console.log("LIST_CUSTOMER_CHAT_SUCCESS_SEARCH => ", data?.data);
      dispatch({
        type: LIST_CUSTOMER_CHAT_SUCCESS_SEARCH,
        payload: data?.data,
      });
    } catch (error) {
      dispatch({ type: SET_CHAT_LOADING_ERROR });
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

export const chatDetail = (page, limit, threadId) => async (dispatch) => {
  try {
    dispatch({ type: SET_MESSAGE_LOADING });
    const { data } = await api.fetchMessages(page, limit, threadId);
    console.log("LIST_ACTIVE_CHAT_SUCCESS => ", data?.data);
    dispatch({ type: LIST_ACTIVE_CHAT_SUCCESS, payload: data?.data });
  } catch (error) {
    dispatch({ type: SET_MESSAGE_LOADING_ERROR });

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

export const listChat = (page, limit) => async (dispatch) => {
  try {
    dispatch({ type: SET_CHAT_LOADING });

    const { data } = await api.fetchInbox(page, limit);
    console.log("LIST_CHAT_SUCCESS => ", data.data);
    dispatch({ type: LIST_CHAT_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_CHAT_LOADING_ERROR });
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

export const createGroup = (chatData) => async (dispatch) => {
  try {
    const groupData = await api.createGroup(chatData);
    // dispatch({ type: SET_CHAT_LOADING });

    const { data } = await api.fetchInbox(1, 100);
    console.log("LIST_CHAT_SUCCESS => ", data.data);
    dispatch({ type: LIST_CHAT_SUCCESS, payload: data.data });
    toast(groupData?.data?.message);
  } catch (error) {
    dispatch({ type: SET_CHAT_LOADING_ERROR });
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

export const clearChat = (id) => async (dispatch) => {
  try {
    const { data } = await api.clearChat(id);
    console.log("clear chat ");
    dispatch({ type: CLEAR_ACTIVE_CHAT_SUCCESS, payload: id });
    // toast(data.message);
  } catch (error) {
    dispatch({ type: SET_CHAT_LOADING_ERROR });
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

export const clearChatGroup = (id, threadId) => async (dispatch) => {
  try {
    const { data } = await api.clearChatGroup(id, threadId);
    console.log("clear chat group ");
    dispatch({ type: LIST_CHAT_SUCCESS, payload: data.data });

    // dispatch({ type: CLEAR_ACTIVE_CHAT_SUCCESS, payload: id });
    // toast(data.message);
  } catch (error) {
    dispatch({ type: SET_CHAT_LOADING_ERROR });
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
