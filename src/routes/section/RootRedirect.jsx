import React from "react";
import { Navigate } from "react-router-dom";
import { LOCAL_STORAGE, ROUTE } from "../../config/constants";

const RootRedirect = () => {
  const isAuthenticated = !!localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
  return isAuthenticated ? (
    <Navigate to={ROUTE.USER_PROFILE} replace />
  ) : (
    <Navigate to={ROUTE.ROOT} replace />
  );
};

export default RootRedirect;
