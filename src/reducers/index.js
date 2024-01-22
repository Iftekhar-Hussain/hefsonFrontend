import { combineReducers } from "redux";
import { userLoginReducer } from "./user";
import { trailerReducer } from "./trailer";
import { driverReducer } from "./driver";
import { truckReducer } from "./truck";
import { deviceReducer } from "./device";
import { shipmentReducer } from "./shipment";
import { profileReducer } from "./profile";
import { soiltableCategoryReducer } from "./soiltableCategory";
import { soiltableReducer } from "./soiltable";
import { customerReducer } from "./customer";
import { alarmReducer } from "./alarm";
import { qrcodeReducer } from "./qrcode";
import { mapDataReducer } from "./mapdata";
import { dashboardReducer } from "./dashboard";
import { chatReducer } from "./chat";
import { notificationReducer } from "./notifications";

export const reducers = combineReducers({
  userLoginReducer,
  trailerReducer,
  driverReducer,
  truckReducer,
  deviceReducer,
  shipmentReducer,
  profileReducer,
  soiltableCategoryReducer,
  soiltableReducer,
  customerReducer,
  alarmReducer,
  qrcodeReducer,
  mapDataReducer,
  dashboardReducer,
  chatReducer,
  notificationReducer,
});
