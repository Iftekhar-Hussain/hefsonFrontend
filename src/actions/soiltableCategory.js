import * as api from "../api/index";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  APPROVE_SOILTABLE_CATEGORY_ADMIN,
  CREATE_SOILTABLE_CATEGORY,
  CREATE_SOILTABLE_CATEGORY_ADMIN,
  DELETE_SOILTABLE_CATEGORY_ADMIN,
  LIST_SOILTABLE_CATEGORY_SUCCESS,
  LIST_SOILTABLE_REQUEST_CATEGORY_SUCCESS,
  SET_SOILTABLE_CATEGORY_ERROR,
  SET_SOILTABLE_CATEGORY_LOADING,
  UPDATE_REQUEST_SOILTABLE_CATEGORY,
  UPDATE_SOILTABLE_CATEGORY_ADMIN,
} from "../constants/soiltableCategory";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const listSoiltableCategory = (page, limit) => async (dispatch) => {
  try {
    dispatch({ type: SET_SOILTABLE_CATEGORY_LOADING });
    // const { data } = await api.fetchSoiltableCategory(page, limit);
    const { data } = await api.fetchRequestSoiltableCategoryAdmin(page, limit);
    console.log("LIST_SOILTABLE_REQUEST_CATEGORY_SUCCESS => ", data);
    dispatch({
      type: LIST_SOILTABLE_REQUEST_CATEGORY_SUCCESS,
      payload: data?.data,
    });
    // dispatch({
    //   type: LIST_SOILTABLE_REQUEST_CATEGORY_SUCCESS,
    //   payload: data,
    // });
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx

      dispatch({ type: SET_SOILTABLE_CATEGORY_ERROR });
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

export const listRequestSoiltableCategory =
  (page, limit) => async (dispatch) => {
    try {
      dispatch({ type: SET_SOILTABLE_CATEGORY_LOADING });
      const { data } = await api.fetchRequestSoiltableCategory(page, limit);
      console.log("LIST_SOILTABLE_REQUEST_CATEGORY_SUCCESS => ", data.data);
      dispatch({
        type: LIST_SOILTABLE_REQUEST_CATEGORY_SUCCESS,
        payload: data.data,
      });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        dispatch({ type: SET_SOILTABLE_CATEGORY_ERROR });
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

export const listRequestSoiltableCategoryAdmin =
  (page, limit) => async (dispatch) => {
    try {
      dispatch({ type: SET_SOILTABLE_CATEGORY_LOADING });
      const { data } = await api.fetchRequestSoiltableCategoryAdmin(
        page,
        limit
      );
      console.log("LIST_SOILTABLE_REQUEST_CATEGORY_SUCCESS => ", data.data);
      dispatch({
        type: LIST_SOILTABLE_CATEGORY_SUCCESS,
        payload: data.data,
      });
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

        dispatch({ type: SET_SOILTABLE_CATEGORY_ERROR });
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

export const requestSoiltableCategory = (unitData) => async (dispatch) => {
  try {
    const { data } = await api.requestSoiltableCategory(unitData);
    console.log("CREATE_SOILTABLE_CATEGORY => ", data.data._id);
    // const sendData = await api.getSoiltableDetail(data.data._id); //
    // console.log("CREATE_SOILTABLE_CATEGORY => ", sendData.data.data);

    // dispatch({ type: CREATE_SOILTABLE_CATEGORY, payload: sendData.data.data });
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

export const createSoiltableCategory = (categoryData) => async (dispatch) => {
  try {
    const { data } = await api.createSoiltableCategory(categoryData);
    console.log("CREATE_SOILTABLE_CATEGORY => ", data.data._id);
    const sendData = await api.getSoiltableCategoryDetail(data.data._id); //
    console.log("CREATE_SOILTABLE_CATEGORY => ", sendData.data.data);

    dispatch({ type: CREATE_SOILTABLE_CATEGORY, payload: sendData.data.data });
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

export const approveSoiltableCatagory =
  (id, categoryData) => async (dispatch) => {
    try {
      console.log("---id -- ", id);

      const approveData = { id: id };
      // console.log("approveData -- ", approveData);
      const { data } = await api.createSoiltableCategory(categoryData);
      console.log("CREATE_SOILTABLE_CATEGORY => ", data.data._id);
      const sendData = await api.getSoiltableCategoryDetail(data.data._id); //
      console.log("CREATE_SOILTABLE_CATEGORY => ", sendData.data.data);
      const approved = await api.approveRequestCat(approveData);
      // console.log("approved -- ", approved?.data?.data?._id);

      dispatch({
        type: CREATE_SOILTABLE_CATEGORY_ADMIN,
        payload: sendData.data.data,
      });
      dispatch({
        type: APPROVE_SOILTABLE_CATEGORY_ADMIN,
        payload: approved?.data?.data?._id,
      });

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

export const approveSoiltableCatagoryStatus =
  (statusData) => async (dispatch) => {
    try {
      console.log("---statusData -- ", statusData);

      const { data } = await api.approveRequestCat(statusData);
      console.log("approveRequestStatus => ", data);
      // const sendData = await api.getSoiltableCategoryDetail(data?.data?._id); //
      // console.log("getSoiltableCategoryDetail => ", sendData?.data?.data);

      // dispatch({
      //   type: UPDATE_SOILTABLE_CATEGORY_ADMIN,
      //   payload: sendData?.data?.data,
      // });

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

export const updateSoiltableCatagory =
  (id, updatedData) => async (dispatch) => {
    try {
      console.log("id, updatedData -- ", id, updatedData);
      const apiData = { ...updatedData, id: id };
      console.log(apiData, "<");
      const { data } = await api.updateSoiltableCatagory(apiData);
      console.log("UPDATE_SOILTABLE_CATEGORY_ADMIN data => ", data.data._id);
      const sendData = await api.getSoiltableCategoryDetail(data.data._id); //
      console.log("UPDATE_SOILTABLE_CATEGORY_ADMIN => ", sendData.data.data);

      dispatch({
        type: UPDATE_SOILTABLE_CATEGORY_ADMIN,
        payload: sendData.data.data,
      });

      toast(data.message);
    } catch (error) {
      dispatch({ type: SET_SOILTABLE_CATEGORY_ERROR });

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

export const editRequestCategory = (id, updatedData) => async (dispatch) => {
  try {
    console.log("id, updatedData -- ", id, updatedData);
    const apiData = { ...updatedData, id: id };
    console.log(apiData, "<");
    const { data } = await api.editRequestCategory(apiData);
    console.log("1 data => ", data?.data);

    dispatch({
      type: UPDATE_REQUEST_SOILTABLE_CATEGORY,
      payload: data?.data,
    });

    console.log(" my => ", data?.data);

    toast(data.message);
  } catch (error) {
    dispatch({ type: SET_SOILTABLE_CATEGORY_ERROR });

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

export const deleteSoiltableCatagory = (id) => async (dispatch) => {
  try {
    const { data } = await api.deleteSoiltableCatagory(id);
    console.log("deleted data wwwwww ");
    dispatch({ type: DELETE_SOILTABLE_CATEGORY_ADMIN, payload: id });
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

export const createSoiltableProduct = (categoryData) => async (dispatch) => {
  try {
    const { data } = await api.requestNewProduct(categoryData);
    console.log("CREATE_SOILTABLE_CATEGORY => ", data.data._id);
    console.log("Solitable data => ", data);
    // const sendData = await api.getSoiltableCategoryDetail(data.data._id); //
    // console.log("CREATE_SOILTABLE_CATEGORY => ", sendData.data.data);

    // dispatch({ type: CREATE_SOILTABLE_CATEGORY, payload: sendData.data.data });
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
