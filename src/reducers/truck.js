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

const truckReducer = (state = { unit: [], loading: true }, action) => {
  switch (action.type) {
    case TRUCK_CHECKBOX_UPDATE:
      return {
        ...state,
        unit: state.unit.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case DELETE_TRUCK_SUCCESS:
      return {
        ...state,
        unit: state.unit.filter((em) => em._id !== action.payload),
        loading: false,
      };

    case UPDATE_TRUCK_SUCCESS:
      return {
        ...state,
        unit: state.unit.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case CREATE_TRUCK_SUCCESS:
      return {
        ...state,
        unit: [action.payload, ...state.unit],
        loading: false,
      };

    case LIST_TRUCK_SUCCESS:
      // const uniquePayload = action.payload.filter(item => !unit.includes(item));
      const uniquePayload = action.payload.data.filter(
        (item) =>
          !state.unit.some((existingItem) => existingItem._id === item._id)
      );
      return {
        ...state,
        unit: [...state.unit, ...uniquePayload],
        loading: false,
        Length: action.payload.total,
      };

    case LIST_TRUCK_SUCCESS_SEARCH:
      return {
        ...state,
        unit: action.payload.data,
        loading: false,
        Length: action.payload.total,
      };

    case SET_TRUCK_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_TRUCK_LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { truckReducer };
