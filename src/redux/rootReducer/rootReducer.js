import { combineReducers } from "redux";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import locationReducer from "../slices/locationSlice";
import notificationReducer from "../slices/notificationSlice";
import tokenReducer from "../slices/tokenSlice";
import currencyReducer from "../slices/currencySlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
  notification: notificationReducer,
  fcmToken: tokenReducer,
  currency: currencyReducer,
});

export default rootReducer;
