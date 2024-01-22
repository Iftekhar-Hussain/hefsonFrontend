import {
  LIST_DASHBOARD_SUCCESS,
  SET_DASHBOARD_LOADING,
  SET_DASHBOARD_LOADING_ERROR,
} from "../constants/dashboard";

const dashboardReducer = (state = { dashboard: {}, loading: true }, action) => {
  switch (action.type) {
    case LIST_DASHBOARD_SUCCESS:
      return {
        ...state,
        dashboard: action.payload.data,
        loading: false,
      };

    case SET_DASHBOARD_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_DASHBOARD_LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { dashboardReducer };
