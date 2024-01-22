import {
  ASSIGN_DEVICE_SUCCESS,
  CREATE_DEVICE_SUCCESS,
  DELETE_DEVICE_SUCCESS,
  LIST_DEVICE_SUCCESS,
  SET_DEVICE_LOADING,
  SET_DEVICE_LOADING_ERROR,
  UPDATE_DEVICE_SUCCESS,
} from "../constants/device";

const deviceReducer = (state = { device: [], loading: true }, action) => {
  switch (action.type) {
    case DELETE_DEVICE_SUCCESS:
      return {
        ...state,
        device: state.device.filter((em) => em._id !== action.payload),
        loading: false,
      };

    case UPDATE_DEVICE_SUCCESS:
      return {
        ...state,
        device: state.device.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case CREATE_DEVICE_SUCCESS:
      return {
        ...state,
        device: [action.payload, ...state.device],
        loading: false,
      };

    case ASSIGN_DEVICE_SUCCESS:
      return {
        ...state,
        device: state.device.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case LIST_DEVICE_SUCCESS:
      // const uniquePayload = action.payload.data.filter(
      //   (item) =>
      //     !state.device.some((existingItem) => existingItem._id === item._id)
      // );
      return {
        ...state,
        device: action.payload.data,
        loading: false,
        Length: action.payload.total,
      };
    case SET_DEVICE_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_DEVICE_LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { deviceReducer };
