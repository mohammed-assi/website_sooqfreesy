import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/homePage";
import { MainLayout } from "../layout/mainLayout";
import { ROUTE } from "../config/constants";
import { ProductPage } from "../pages/product";
import { ProductDetail } from "../pages/productDetail";
import { SellerProfile } from "../pages/sellerProfile";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path={ROUTE.PRODUCT_PAGE} element={<ProductPage />} />
        <Route path={`${ROUTE.PRODUCT_PAGE}/:id`} element={<ProductDetail />} />
        <Route path={ROUTE.SELLER_PROFILE} element={<SellerProfile />} />
      </Route>
    </Routes>
  );
};
