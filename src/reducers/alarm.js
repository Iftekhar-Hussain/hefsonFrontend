import {
  LIST_ALARM_PAST_SUCCESS,
  LIST_ALARM_SUCCESS,
  SET_ALARM_LOADING,
  SET_ALARM_LOADING_ERROR,
} from "../constants/alarm";

const alarmReducer = (
  state = { alarm: [], alarmPast: [], loading: true },
  action
) => {
  switch (action.type) {
    case LIST_ALARM_SUCCESS:
      const uniquePayload = action.payload.data.filter(
        (item) =>
          !state.alarm.some((existingItem) => existingItem._id === item._id)
      );
      return {
        ...state,
        alarm: [...state.alarm, ...uniquePayload],
        loading: false,
        Length: action.payload.total,
      };
    case LIST_ALARM_PAST_SUCCESS:
      const uniquePayloadPast = action.payload.data.filter(
        (item) =>
          !state.alarmPast.some((existingItem) => existingItem._id === item._id)
      );
      return {
        ...state,
        alarmPast: [...state.alarmPast, ...uniquePayloadPast],
        loading: false,
        LengthPast: action.payload.total,
      };

    case SET_ALARM_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_ALARM_LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { alarmReducer };
