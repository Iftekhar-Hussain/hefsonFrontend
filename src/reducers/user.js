import {
  END_TOKEN_REQUEST,
  RESET_PASSWORD,
  USER_FORGOT_PASSWORD,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_SIGNUP_FAIL,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  VERIFY_TOKEN_FAIL,
  VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
} from "../constants/user";

const userLoginReducer = (user = {}, action) => {
  switch (action.type) {
    case USER_SIGNUP_REQUEST:
      return { loading: true };
    case USER_SIGNUP_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_SIGNUP_FAIL:
      return { loading: false, error: action.payload };

    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return { ...user, userInfo: null };

    case USER_FORGOT_PASSWORD:
      return user;
    case RESET_PASSWORD:
      return user;

    case VERIFY_TOKEN_REQUEST:
      return { loading: true, verify: action.payload };
    case VERIFY_TOKEN_SUCCESS:
      return { loading: false, verify: action.payload };
    case VERIFY_TOKEN_FAIL:
      return { loading: false, error: action.payload };
    case END_TOKEN_REQUEST:
      return {};
    default:
      return user;
  }
};

// const reducer = (emp = [], action) => {
//   switch (action.type) {
//     case DELETE_EMP:
//       return emp.filter((em) => em._id !== action.payload);

//     case UPDATE_EMP:
//       return emp.map((em) =>
//         em._id === action.payload._id ? action.payload : em
//       );

//     case FETCH_EMP:
//       return action.payload;

//     case CREATE_EMP:
//       return [...emp, action.payload];

//     default:
//       return emp;
//   }
// };

export { userLoginReducer };
