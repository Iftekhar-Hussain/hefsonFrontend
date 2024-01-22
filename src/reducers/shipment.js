import {
  CREATE_SHIPMENT_SUCCESS,
  LIST_SHIPMENT_SUCCESS,
  LIST_SHIPMENT_SUCCESS_CANCEL,
  LIST_SHIPMENT_SUCCESS_COMPLETE,
  SET_SHIPMENT_LOADING,
  SET_SHIPMENT_LOADING_ERROR,
  UPDATE_SHIPMENT_SUCCESS,
} from "../constants/shipment";

const shipmentReducer = (
  state = {
    shipmentCancel: [],
    shipmentComplete: [],
    shipment: [],
    loading: false,
  },
  action
) => {
  switch (action.type) {
    case UPDATE_SHIPMENT_SUCCESS:
      return {
        ...state,
        shipment: state.shipment.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case CREATE_SHIPMENT_SUCCESS:
      return {
        ...state,
        shipment: [action.payload, ...state.shipment],
        loading: false,
      };

    case LIST_SHIPMENT_SUCCESS:
      // const uniquePayload = action.payload.filter(
      //   (item) => !state.shipment.includes(item)
      // );
      // const uniquePayload = action.payload.list.filter(
      //   (item) =>
      //     !state.shipment.some((existingItem) => existingItem._id === item._id)
      // );

      return {
        ...state,
        shipment: action.payload.list,
        loading: false,
        Length: action.payload.total,
      };

    case LIST_SHIPMENT_SUCCESS_COMPLETE:
      const unique = action.payload.list.filter(
        (item) =>
          !state.shipmentComplete.some(
            (existingItem) => existingItem._id === item._id
          )
      );
      return {
        ...state,
        shipmentComplete: [...state.shipmentComplete, ...unique],
        loading: false,
        Length: action.payload.total,
      };
      
    case LIST_SHIPMENT_SUCCESS_CANCEL:
      const uniquepayload = action.payload.list.filter(
        (item) =>
          !state.shipmentCancel.some(
            (existingItem) => existingItem._id === item._id
          )
      );
      return {
        ...state,
        shipmentCancel: [...state.shipmentCancel, ...uniquepayload],
        loading: false,
        Length: action.payload.total,
      };

    case SET_SHIPMENT_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_SHIPMENT_LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { shipmentReducer };
