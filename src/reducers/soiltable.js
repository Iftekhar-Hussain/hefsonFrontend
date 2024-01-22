import {
  APPROVE_SOILTABLE_SUCCESS,
  CREATE_SOILTABLE,
  LIST_SOILTABLE_SUCCESS,
  SET_SOILTABLE_ERROR,
  SET_SOILTABLE_LOADING,
  UPDATE_SOILTABLE_SUCCESS,
} from "../constants/soiltable";
import { LIST_SOILTABLE_DETAIL_SUCCESS } from "../constants/soiltableCategory";

const soiltableReducer = (
  state = { soiltableDetail: {}, soiltable: [], loading: true },
  action
) => {
  switch (action.type) {
    case CREATE_SOILTABLE:
      return {
        ...state,
        soiltable: [action.payload, ...state.soiltable],
        loading: false,
      };

    case LIST_SOILTABLE_SUCCESS:
      return {
        ...state,
        soiltable: action.payload,
        loading: false,
        Length: action.payload.length,
      };

    case UPDATE_SOILTABLE_SUCCESS:
      return {
        ...state,
        soiltable: state.soiltable.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case APPROVE_SOILTABLE_SUCCESS:
      return {
        ...state,
        soiltable: state.soiltable.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case LIST_SOILTABLE_DETAIL_SUCCESS:
      return {
        ...state,
        soiltableDetail: action.payload,
        loading: false,
      };

    case SET_SOILTABLE_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_SOILTABLE_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { soiltableReducer };
