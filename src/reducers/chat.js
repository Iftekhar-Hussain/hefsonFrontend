import {
  CLEAR_ACTIVE_CHAT_SUCCESS,
  LIST_ACTIVE_CHAT_SUCCESS,
  LIST_CHAT_SUCCESS,
  LIST_CUSTOMER_CHAT_SUCCESS_SEARCH,
  SET_CHAT_LOADING,
  SET_CHAT_LOADING_ERROR,
  SET_MESSAGE_LOADING,
  SET_MESSAGE_LOADING_ERROR,
} from "../constants/chat";

const chatReducer = (
  state = {
    activechat: [],
    chat: [],
    chatSearch: [],
    group: [],
    loading: true,
    chatLoading: false,
  },
  action
) => {
  switch (action.type) {
    case LIST_CUSTOMER_CHAT_SUCCESS_SEARCH:
      const uniqueChat = action.payload?.data.filter(
        (item) =>
          !state.chatSearch.some((existingItem) => existingItem._id === item._id)
      );
      const uniqueGroup = action.payload?.groupData.filter(
        (item) =>
          !state.group.some((existingItem) => existingItem._id === item._id)
      );
      return {
        ...state,
        chatSearch: uniqueChat,
        group: uniqueGroup,
        loading: false,
        Length: action.payload.total,
      };
    case LIST_ACTIVE_CHAT_SUCCESS:
      return {
        ...state,
        activechat: action.payload.data,
        loading: false,
        chatLoading: false,
      };

    case CLEAR_ACTIVE_CHAT_SUCCESS:
      return {
        ...state,
        activechat: [],
        loading: false,
        chatLoading: false,
      };

    case LIST_CHAT_SUCCESS:
      const uniquePayload = action.payload.data.filter(
        (item) =>
          !state.chat.some((existingItem) => existingItem._id === item._id)
      );
      return {
        ...state,
        chat: [...state.chat, ...uniquePayload],
        loading: false,
        Length: action.payload.total,
      };

    case SET_MESSAGE_LOADING:
      return {
        ...state,
        chatLoading: true,
      };

    case SET_MESSAGE_LOADING_ERROR:
      return {
        ...state,
        chatLoading: false,
      };
    case SET_CHAT_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_CHAT_LOADING_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { chatReducer };
