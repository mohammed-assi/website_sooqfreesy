import { combineReducers } from "redux";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import locationReducer from "../slices/locationSlice";
import notificationReducer from "../slices/notificationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
  notification: notificationReducer,
});

export default rootReducer;
