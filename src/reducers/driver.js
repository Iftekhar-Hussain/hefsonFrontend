import {
  CREATE_DRIVER_SUCCESS,
  DELETE_DRIVER_SUCCESS,
  DRIVER_CHECKBOX_UPDATE,
  LIST_DRIVER_SUCCESS,
  LIST_DRIVER_SUCCESS_SEARCH,
  SET_DRIVER_LOADING,
  SET_DRIVER_LOADING_ERROR,
  UPDATE_DRIVER_SUCCESS,
} from "../constants/driver";

const driverReducer = (state = { driver: [], loading: true }, action) => {
  switch (action.type) {
    case DRIVER_CHECKBOX_UPDATE:
      return {
        ...state,
        driver: state.driver.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case DELETE_DRIVER_SUCCESS:
      return {
        ...state,
        driver: state.driver.filter((em) => em._id !== action.payload),
        loading: false,
      };

    case UPDATE_DRIVER_SUCCESS:
      return {
        ...state,
        driver: state.driver.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case CREATE_DRIVER_SUCCESS:
      return {
        ...state,
        driver: [action.payload, ...state.driver],
        loading: false,
      };

    case LIST_DRIVER_SUCCESS:
      const uniquePayload = action.payload.list.filter(
        (item) =>
          !state.driver.some((existingItem) => existingItem._id === item._id)
      );
      return {
        ...state,
        driver: [...state.driver, ...uniquePayload],
        loading: false,
        Length: action.payload.total,
      };

    case LIST_DRIVER_SUCCESS_SEARCH:
      return {
        ...state,
        driver: action.payload.list,
        loading: false,
        Length: action.payload.total,
      };

    case SET_DRIVER_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_DRIVER_LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { driverReducer };
