import {
  APPROVE_SOILTABLE_CATEGORY_ADMIN,
  CREATE_SOILTABLE_CATEGORY,
  CREATE_SOILTABLE_CATEGORY_ADMIN,
  CREATE_SOILTABLE_PRODUCT_ADMIN,
  DELETE_SOILTABLE_CATEGORY_ADMIN,
  LIST_SOILTABLE_CATEGORY_SUCCESS,
  LIST_SOILTABLE_REQUEST_CATEGORY_SUCCESS,
  SET_SOILTABLE_CATEGORY_ERROR,
  SET_SOILTABLE_CATEGORY_LOADING,
  UPDATE_REQUEST_SOILTABLE_CATEGORY,
  UPDATE_SOILTABLE_CATEGORY_ADMIN,
} from "../constants/soiltableCategory";

const soiltableCategoryReducer = (
  state = {
    soiltableProduct: {},
    soiltableCategoryAdmin: [],
    soiltableRequestCategory: [],
    soiltableRequestCategoryAdmin: [],
    loading: true,
  },
  action
) => {
  switch (action.type) {
    case CREATE_SOILTABLE_CATEGORY:
      return {
        ...state,
        soiltableRequestCategoryAdmin: [
          action.payload,
          ...state.soiltableRequestCategoryAdmin,
        ],
        loading: false,
      };

    case CREATE_SOILTABLE_CATEGORY_ADMIN:
      return {
        ...state,
        soiltableCategoryAdmin: [
          action.payload,
          ...state.soiltableCategoryAdmin,
        ],
        loading: false,
      };

    case APPROVE_SOILTABLE_CATEGORY_ADMIN:
      return {
        ...state,
        soiltableRequestCategory: state.soiltableRequestCategory.filter(
          (em) => em._id !== action.payload
        ),
        loading: false,
      };

    case CREATE_SOILTABLE_PRODUCT_ADMIN:
      return {
        ...state,
        soiltableProduct: action.payload,
        loading: false,
      };

    case UPDATE_SOILTABLE_CATEGORY_ADMIN:
      return {
        ...state,
        soiltableRequestCategoryAdmin: state.soiltableRequestCategoryAdmin.map(
          (em) => (em._id === action.payload._id ? action.payload : em)
        ),
        loading: false,
      };

    case UPDATE_REQUEST_SOILTABLE_CATEGORY:
      return {
        ...state,
        soiltableRequestCategory: state.soiltableRequestCategory.map((em) =>
          em._id === action.payload._id ? action.payload : em
        ),
        loading: false,
      };

    case DELETE_SOILTABLE_CATEGORY_ADMIN:
      return {
        ...state,
        soiltableRequestCategoryAdmin:
          state.soiltableRequestCategoryAdmin.filter(
            (em) => em._id !== action.payload
          ),
        loading: false,
      };

    case LIST_SOILTABLE_CATEGORY_SUCCESS:
      const uniquePayloadc = action.payload.data.filter(
        (item) =>
          !state.soiltableRequestCategoryAdmin.some(
            (existingItem) => existingItem._id === item._id
          )
      );

      return {
        ...state,
        soiltableRequestCategoryAdmin: [
          ...state.soiltableRequestCategoryAdmin,
          ...uniquePayloadc,
        ],
        loading: false,
        Length: action.payload.length,
      };

    case LIST_SOILTABLE_REQUEST_CATEGORY_SUCCESS:
      const uniquePayload = action.payload.data.filter(
        (item) =>
          !state.soiltableRequestCategory.some(
            (existingItem) => existingItem._id === item._id
          )
      );

      return {
        ...state,
        soiltableRequestCategory: [
          ...state.soiltableRequestCategory,
          ...uniquePayload,
        ],
        loading: false,
        Length: action.payload.length,
      };

    case SET_SOILTABLE_CATEGORY_LOADING:
      return {
        ...state,
        loading: true,
      };

    case SET_SOILTABLE_CATEGORY_ERROR:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export { soiltableCategoryReducer };
