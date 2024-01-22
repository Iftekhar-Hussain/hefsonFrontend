import {
  CREATE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_SUCCESS,
  CUSTOMER_CHECKBOX_UPDATE,
  LIST_CUSTOMER_SUCCESS,
  SET_CUSTOMER_LOADING,
  SET_CUSTOMER_LOADING_ERROR,
  UPDATE_CUSTOMER_SUCCESS,
  LIST_CUSTOMER_SUCCESS_SEARCH,
} from "../constants/customer";

const customerReducer = (state = { customer: [], loading: true }, action) => {
  switch (action.type) {
    case CUSTOMER_CHECKBOX_UPDATE:
      return {
        ...state,
        customer: state.customer.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case DELETE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customer: state.customer.filter((em) => em._id !== action.payload),
        loading: false,
      };

    case UPDATE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customer: state.customer.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case CREATE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customer: [action.payload, ...state.customer],
        loading: false,
      };

    case LIST_CUSTOMER_SUCCESS:
      // const uniquePayload = action.payload.data.filter(
      //   (item) =>
      //     !state.customer.some((existingItem) => existingItem._id === item._id)
      // );
      return {
        ...state,
        customer: action.payload?.data,
        loading: false,
        Length: action.payload.total,
      };

    case LIST_CUSTOMER_SUCCESS_SEARCH:
      return {
        ...state,
        customer: action.payload.data,
        loading: false,
        Length: action.payload.total,
      };
    case SET_CUSTOMER_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_CUSTOMER_LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { customerReducer };
