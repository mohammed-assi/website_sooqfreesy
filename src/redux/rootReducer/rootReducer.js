import { combineReducers } from "redux";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import locationReducer from "../slices/locationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
});

export default rootReducer;
