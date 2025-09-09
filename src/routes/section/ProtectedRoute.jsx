import { Navigate } from "react-router-dom";
import { LOCAL_STORAGE, ROUTE } from "../../config/constants";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  return isAuthenticated ? children : <Navigate to={ROUTE.ROOT} replace />;
};

export default ProtectedRoute;
