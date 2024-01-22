import * as api from "../api/index";
import {
  CREATE_DRIVER_SUCCESS,
  DELETE_DRIVER_SUCCESS,
  DRIVER_CHECKBOX_UPDATE,
  LIST_DRIVER_SUCCESS,
  SET_DRIVER_LOADING_ERROR,
  UPDATE_DRIVER_SUCCESS,
} from "../constants/driver";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  CREATE_CUSTOMER_SUCCESS,
  CUSTOMER_CHECKBOX_UPDATE,
  DELETE_CUSTOMER_SUCCESS,
  LIST_CUSTOMER_SUCCESS,
  LIST_CUSTOMER_SUCCESS_SEARCH,
  SET_CUSTOMER_LOADING_ERROR,
  UPDATE_CUSTOMER_SUCCESS,
} from "../constants/customer";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

// export const deleteDriver = (id) => async (dispatch) => {
//   try {
//     await api.deleteDriver(id);
//     dispatch({ type: DELETE_DRIVER_SUCCESS, payload: id });
//     // toast("User deleted successfully");
//   } catch (error) {
//     console.log(error.message);
//     console.log(error);
//     if (loginToken === null) {
//       window.location.replace("/login");
//     }
//     if (
//       error.response &&
//       error.response.data.message ===
//         "You are not an authorized user for this action."
//     ) {
//       window.location.replace("/login");
//     }
//     if (error.response && error.response.status === 400) {
//       return toast(error.response.data.message);
//     }
//     if (error.response) {
//       if (error.response && error.response.status === 400) {
//         return toast(error.response.data.message);
//       }
//     }
//   }
// };

export const updateDriver = (id, updatedData) => async (dispatch) => {
  try {
    const { data } = await api.updateDriver(id, updatedData);
    console.log("UPDATE_CUSTOMER_SUCCESS => ", data);
    const sendData = await api.getCustomerDetail(data.data._id);
    console.log("UPDATE_CUSTOMER_SUCCESS dd => ", sendData);

    dispatch({ type: UPDATE_CUSTOMER_SUCCESS, payload: sendData.data.data[0] });
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

//   try {
//     const { data } = await api.createDriver(driverData);
//     console.log("CREATE_TRUCK_SUCCESS => ", data);
//     const sendData = await api.getDriverDetail(data.data._id);
//     console.log("CREATE_TRUCK_SUCCESS => ", sendData);

//     dispatch({ type: CREATE_DRIVER_SUCCESS, payload: sendData.data.data[0] });
//     toast(data.message);
//   } catch (error) {
//     console.log(error);
//     if (loginToken === null) {
//       window.location.replace("/login");
//     }
//     if (
//       error.response &&
//       error.response.data.message ===
//         "You are not an authorized user for this action."
//     ) {
//       window.location.replace("/login");
//     }
//     if (error.response && error.response.status === 400) {
//       return toast(error.response.data.message);
//     }
//     if (error.response) {
//       if (error.response && error.response.status === 400) {
//         return toast(error.response.data.message);
//       }
//     }
//   }
// };

// ---------------------------------------------------------------

export const listSearchCustomer = (page, limit, search) => async (dispatch) => {
  try {
    const { data } = await api.fetchSearchCustomers(page, limit, search);
    console.log("LIST_CUSTOMER_SUCCESS => ", data.data);
    dispatch({ type: LIST_CUSTOMER_SUCCESS_SEARCH, payload: data.data });
  } catch (error) {
    dispatch({ type: SET_CUSTOMER_LOADING_ERROR });
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

export const listCustomer = (page, limit, role) => async (dispatch) => {
  try {
    console.log("serach =====+ ", role);
    let data;
    if (role === 0) {
      data = await api.fetchCustomersAll(page, limit);
    } else {
      data = await api.fetchCustomers(page, limit, role);
    }
    console.log("LIST_CUSTOMER_SUCCESS => ", data?.data?.data);
    dispatch({ type: LIST_CUSTOMER_SUCCESS, payload: data?.data?.data });
  } catch (error) {
    dispatch({ type: SET_CUSTOMER_LOADING_ERROR });
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

export const updateCheckboxCustomer = (dataId, checked) => async (dispatch) => {
  try {
    const { data } = await api.updateCheckboxDriver(dataId, checked);
    // console.log("DRIVER_CHECKBOX_UPDATE => ", data.data._id);

    const sendData = await api.getCustomerDetail(data.data._id);

    // console.log("DRIVER_CHECKBOX_UPDATE => ", sendData);

    dispatch({
      type: CUSTOMER_CHECKBOX_UPDATE,
      payload: sendData.data.data[0],
    });
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
    } // VVI if user is logging in with past token
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

export const deleteCustomer = (id) => async (dispatch) => {
  try {
    await api.deleteDriver(id);
    dispatch({ type: DELETE_CUSTOMER_SUCCESS, payload: id });
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

export const createCustomer = (driverData) => async (dispatch) => {
  try {
    const { data } = await api.createCustomer(driverData);
    console.log("CREATE_CUSTOMER_SUCCESS => ", data);
    const sendData = await api.getCustomerDetail(data.data._id);
    console.log("CREATE_CUSTOMER_SUCCESS => ", sendData);

    dispatch({ type: CREATE_CUSTOMER_SUCCESS, payload: sendData.data.data[0] });
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

export const createDriverCustomer = (driverData) => async (dispatch) => {
  try {
    const { data } = await api.createDriver(driverData);
    console.log("CREATE_TRUCK_SUCCESS => ", data);
    const sendData = await api.getCustomerDetail(data.data._id);
    console.log("CREATE_CUSTOMER_SUCCESS => ", sendData);

    dispatch({ type: CREATE_CUSTOMER_SUCCESS, payload: sendData.data.data[0] });
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


export const updateCustomer = (id, updatedData) => async (dispatch) => {
  try {
    console.log("updatedData  1111 ", updatedData)
    const { data } = await api.updateCustomer(id, updatedData);
    console.log("UPDATE_UNIT_SUCCESS => ", data);
    const sendData = await api.getCustomerDetail(data.data._id);
    console.log("CREATE_TRUCK_SUCCESS => ", sendData);

    dispatch({ type: UPDATE_CUSTOMER_SUCCESS, payload: sendData.data.data[0] });
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

export const updateDriverInCustomer = (id, updatedData) => async (dispatch) => {
  try {
    const { data } = await api.updateDriver(id, updatedData);
    console.log("UPDATE_UNIT_SUCCESS => ", data);
    const sendData = await api.getCustomerDetail(data.data._id);
    console.log("CREATE_TRUCK_SUCCESS => ", sendData);

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