import { UPDATE_USER_PROFILE_SUCCESS } from "../constants/profile";
import {
  GET_USER_PROFILE_FAIL,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
} from "../constants/profile";

const profileReducer = (state = { profile: {}, loading: true }, action) => {
  switch (action.type) {
    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };

    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };

    case GET_USER_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_USER_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { profileReducer };
