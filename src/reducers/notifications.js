import {
  LIST_NOTIFICATIONS_SUCCESS,
  SET_NOTIFICATIONS_LOADING,
  SET_NOTIFICATIONS_LOADING_ERROR,
} from "../constants/notifications";

const notificationReducer = (
  state = { notifications: [], loading: true, unReadCount: 0 },
  action
) => {
  switch (action.type) {
    case LIST_NOTIFICATIONS_SUCCESS:
      const uniquePayloadPast = action.payload?.data?.filter(
        (item) =>
          !state.notifications.some((existingItem) => existingItem._id === item._id)
      );
      return {
        ...state,
        notifications: [...state.notifications, ...uniquePayloadPast],
        loading: false,
        Length: action.payload.total,
        unReadCount: action.payload.unReadCount,
      };

    case SET_NOTIFICATIONS_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_NOTIFICATIONS_LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { notificationReducer };
