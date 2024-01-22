import {
  LIST_QRCODE_SUCCESS,
  SET_QRCODE_ERROR,
  SET_QRCODE_LOADING,
} from "../constants/qrcode";

const qrcodeReducer = (
  state = {
    qrcode: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case LIST_QRCODE_SUCCESS:
      // const uniquePayload = action.payload.data.filter(
      //   (item) =>
      //     !state.qrcode.some((existingItem) => existingItem._id === item._id)
      // );

      return {
        ...state,
        // qrcode: [...state.qrcode, ...uniquePayload],
        qrcode: action.payload.data,
        loading: false,
        Length: action.payload.total,
      };

    case SET_QRCODE_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_QRCODE_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { qrcodeReducer };
