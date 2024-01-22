import * as api from "../api/index";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  LIST_SHIPMENT_SUCCESS,
  LIST_SHIPMENT_SUCCESS_CANCEL,
  LIST_SHIPMENT_SUCCESS_COMPLETE,
  SET_SHIPMENT_LOADING,
  SET_SHIPMENT_LOADING_ERROR,
  UPDATE_SHIPMENT_SUCCESS,
} from "../constants/shipment";

const loginToken = Cookies.get("loginToken")
  ? JSON.parse(Cookies.get("loginToken"))
  : null;

export const updateShipment = (id, updatedData) => async (dispatch) => {
  try {
    const { data } = await api.updateShipment(id, updatedData);
    console.log("UPDATE_SHIPMENT_SUCCESS data => ", data);
    const sendData = await api.getShipmentDetail(data.data._id);
    console.log("UPDATE_SHIPMENT_SUCCESS => ", sendData.data.data);
    dispatch({ type: UPDATE_SHIPMENT_SUCCESS, payload: sendData.data.data });
    toast(data.message);
    Cookies.remove("truckId");
    Cookies.remove("trailerId");
    Cookies.remove("driverId");
    Cookies.remove("pickupName");
    Cookies.remove("pickupAddress");
    Cookies.remove("pickupDate");
    Cookies.remove("pickupTime");
    Cookies.remove("poNumber");
    Cookies.remove("deliveryName");
    Cookies.remove("deliveryAddress");
    Cookies.remove("deliveryDate");
    Cookies.remove("deliveryTime");
    Cookies.remove("deliveryNumber");
    Cookies.remove("actual");
    Cookies.remove("min");
    Cookies.remove("max");
    Cookies.remove("referenceNumber");
    Cookies.remove("comment");
    Cookies.remove("name");
    Cookies.remove("brokerAgent");
    Cookies.remove("brokerPhone");
    Cookies.remove("brokerhefsonId");
    Cookies.remove("dispatchName");
    Cookies.remove("carrierPhone");
    Cookies.remove("carrierEmergencyPhone");
    Cookies.remove("latitudeShipper");
    Cookies.remove("longitudeShipper");
    Cookies.remove("latitudeReceiver");
    Cookies.remove("longitudeReceiver");
    window.location.replace("/Shipment");
  } catch (error) {
    dispatch({ type: SET_SHIPMENT_LOADING_ERROR });

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

export const createShipment = (shipmentData) => async (dispatch) => {
  try {
    dispatch({ type: SET_SHIPMENT_LOADING });

    const { data } = await api.createShipment(shipmentData);
    console.log("CREATE_SHIPMENT_SUCCESS => ", data);
    console.log("ddddddddnnnnf", data.data._id);

    Cookies.remove("truckId");
    Cookies.remove("trailerId");
    Cookies.remove("driverId");
    Cookies.remove("shipper");
    Cookies.remove("receiver");

    Cookies.remove("pickupName");
    Cookies.remove("pickupAddress");
    Cookies.remove("pickupDate");
    Cookies.remove("pickupTime");
    Cookies.remove("poNumber");
    Cookies.remove("deliveryName");
    Cookies.remove("deliveryAddress");
    Cookies.remove("deliveryDate");
    Cookies.remove("deliveryTime");
    Cookies.remove("deliveryNumber");

    Cookies.remove("actual");
    Cookies.remove("min");
    Cookies.remove("max");
    Cookies.remove("referenceNumber");
    Cookies.remove("comment");
    Cookies.remove("name");
    Cookies.remove("brokerAgent");
    Cookies.remove("brokerPhone");
    Cookies.remove("brokerhefsonId");
    Cookies.remove("dispatchName");
    Cookies.remove("carrierPhone");
    Cookies.remove("carrierEmergencyPhone");

    Cookies.remove("latitudeShipper");
    Cookies.remove("longitudeShipper");
    Cookies.remove("latitudeReceiver");
    Cookies.remove("longitudeReceiver");
    toast(data.message);
    dispatch({ type: SET_SHIPMENT_LOADING_ERROR });
    window.location.replace("/Shipment");
  } catch (error) {
    dispatch({ type: SET_SHIPMENT_LOADING_ERROR });

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

export const listShipment =
  (page, limit, sortBy, sortValue) => async (dispatch) => {
    try {
      dispatch({ type: SET_SHIPMENT_LOADING });
      const { data } = await api.fetchShipment(page, limit, sortBy, sortValue);
      console.log("LIST_SHIPMENT_SUCCESS => ", data.data);
      dispatch({ type: LIST_SHIPMENT_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: SET_SHIPMENT_LOADING_ERROR });
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

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

export const listShipmentSearch =
  (page, limit, sortBy, sortValue, search) => async (dispatch) => {
    try {
      dispatch({ type: SET_SHIPMENT_LOADING });
      const { data } = await api.fetchShipmentSearch(
        page,
        limit,
        sortBy,
        sortValue,
        search
      );
      console.log("LIST_SHIPMENT_SUCCESS => ", data.data);
      dispatch({ type: LIST_SHIPMENT_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: SET_SHIPMENT_LOADING_ERROR });
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

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

export const listShipmentComplete =
  (page, limit, sortBy, sortValue) => async (dispatch) => {
    try {
      dispatch({ type: SET_SHIPMENT_LOADING });
      const { data } = await api.fetchShipmentComplete(
        page,
        limit,
        sortBy,
        sortValue
      );
      console.log("LIST_SHIPMENT_SUCCESS_COMPLETE => ", data.data);
      dispatch({ type: LIST_SHIPMENT_SUCCESS_COMPLETE, payload: data.data });
    } catch (error) {
      dispatch({ type: SET_SHIPMENT_LOADING_ERROR });
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

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

export const listShipmentCancel =
  (page, limit, sortBy, sortValue) => async (dispatch) => {
    try {
      dispatch({ type: SET_SHIPMENT_LOADING });
      const { data } = await api.fetchShipmentCancel(
        page,
        limit,
        sortBy,
        sortValue
      );
      console.log("LIST_SHIPMENT_SUCCESS_COMPLETE cancel => ", data.data);
      dispatch({ type: LIST_SHIPMENT_SUCCESS_CANCEL, payload: data.data });
    } catch (error) {
      dispatch({ type: SET_SHIPMENT_LOADING_ERROR });
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx

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
