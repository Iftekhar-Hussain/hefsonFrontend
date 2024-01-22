import {
  GET_MAP_DATA,
  GET_MAP_DATA_DEVICE,
  GET_MAP_DATA_ERROR,
  GET_MAP_DATA_ERROR_DEVICE,
  GET_MAP_DATA_LOADING,
  GET_MAP_DATA_LOADING_DEVICE,
} from "../constants/mapData";

const mapDataReducer = (
  state = { mapDataDevice: [], mapData: [], loadingMapData: true },
  action
) => {
  switch (action.type) {
    case GET_MAP_DATA:
      const uniquePayload = action.payload.filter(
        (item) =>
          !state.mapData.some((existingItem) => existingItem._id === item._id)
      );
      return {
        ...state,
        mapData: [...state.mapData, ...uniquePayload],
        loadingMapData: false,
      };

    case GET_MAP_DATA_LOADING:
      return {
        ...state,
        loadingMapData: true,
      };

    case GET_MAP_DATA_ERROR:
      return {
        ...state,
        loadingMapData: false,
      };
    case GET_MAP_DATA_DEVICE:
      const uniquePayloadDevice = action.payload.filter(
        (item) =>
          !state.mapDataDevice.some(
            (existingItem) => existingItem._id === item._id
          )
      );
      return {
        ...state,
        mapDataDevice: [...state.mapDataDevice, ...uniquePayloadDevice],
        loadingMapData: false,
      };

    case GET_MAP_DATA_LOADING_DEVICE:
      return {
        ...state,
        loadingMapData: true,
      };

    case GET_MAP_DATA_ERROR_DEVICE:
      return {
        ...state,
        loadingMapData: false,
      };

    default:
      return state;
  }
};

export { mapDataReducer };
