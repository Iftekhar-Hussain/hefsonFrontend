import {
  CREATE_TRAILER_SUCCESS,
  DELETE_TRAILER_SUCCESS,
  LIST_TRAILER_DETAIL_SUCCESS,
  LIST_TRAILER_SUCCESS,
  SET_TRAILER_LOADING,
  SET_TRAILER_LOADING_ERROR,
  TRAILER_CHECKBOX_UPDATE,
  UPDATE_TRAILER_DETAIL_SUCCESS,
  UPDATE_TRAILER_SUCCESS,
  LIST_TRAILER_SUCCESS_SEARCH
} from "../constants/trailer";

const trailerReducer = (
  state = { trailerDetail: {}, trailer: [], loading: true },
  action
) => {
  switch (action.type) {
    case TRAILER_CHECKBOX_UPDATE:
      return {
        ...state,
        trailer: state.trailer.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case DELETE_TRAILER_SUCCESS:
      return {
        ...state,
        trailer: state.trailer.filter((em) => em._id !== action.payload),
        loading: false,
      };

    case UPDATE_TRAILER_SUCCESS:
      return {
        ...state,
        trailer: state.trailer.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case CREATE_TRAILER_SUCCESS:
      return {
        ...state,
        trailer: [action.payload, ...state.trailer],
        loading: false,
      };

    case LIST_TRAILER_SUCCESS:
      const uniquePayload = action.payload.data.filter(
        (item) =>
          !state.trailer.some((existingItem) => existingItem._id === item._id)
      );
      return {
        ...state,
        trailer: [...state.trailer, ...uniquePayload],
        loading: false,
        Length: action.payload.total,
      };

    case LIST_TRAILER_SUCCESS_SEARCH:
      return {
        ...state,
        trailer: action.payload.data,
        loading: false,
        Length: action.payload.total,
      };
    case SET_TRAILER_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_TRAILER_LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    case LIST_TRAILER_DETAIL_SUCCESS:
      return {
        ...state,
        trailerDetail: action.payload,
        loading: false,
      };

    case UPDATE_TRAILER_DETAIL_SUCCESS:
      return {
        ...state,
        trailerDetail: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export { trailerReducer };
