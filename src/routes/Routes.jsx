import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/homePage";
import { MainLayout } from "../layout/mainLayout";
import { ROUTE } from "../config/constants";
import { ProductPage } from "../pages/product";
import { ProductDetail } from "../pages/productDetail";
import { SellerProfile } from "../pages/sellerProfile";
import { ProfilePage } from "../pages/dashboard/profilePage";
import { DashboardLayout } from "../pages/dashboard/layout/mainLayout/DashboardLayout";
import { MyAds } from "../pages/dashboard/myAds";
import { MyWishlist } from "../pages/dashboard/wishlist";
import { Notifictions } from "../pages/dashboard/notifications";
import { HelpSupport } from "../pages/helpSupport";
import { AboutUs } from "../pages/aboutUs";
import { TermConditions } from "../pages/termConditions";
import { PrivacyPolicy } from "../pages/privacyPolicy";
import ProtectedRoute from "./section/ProtectedRoute";
import UnprotectedRoute from "./section/UnprotectedRoute";
import { CreatePost } from "../pages/createPost";
import { EditPost } from "../pages/editPost";
import NotFoundPage from "../pages/notFoundPage";
import ProductDetailsWrapper from "../utils/redirectToProductDetails";

export const Router = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path={ROUTE.PRODUCT_PAGE} element={<ProductPage />} />
        {/* <Route path={`${ROUTE.PRODUCT_PAGE}/:id`} element={<ProductDetail />} /> */}
        <Route path={`${ROUTE.PRODUCT_PAGE}/:id`} element={<ProductDetailsWrapper />} />
        <Route
          path={`${ROUTE.SELLER_PROFILE}/:id`}
          element={<SellerProfile />}
        />
        <Route path={ROUTE.ABOUT_US} element={<AboutUs />} />
        <Route path={ROUTE.TERMS_CONDITIONS} element={<TermConditions />} />
        <Route path={ROUTE.PRIVACY_POLICY} element={<PrivacyPolicy />} />
        <Route path={ROUTE.HELP_SUPPORT} element={<HelpSupport />} />
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTE.CREATE_POST} element={<CreatePost />} />
          <Route path={`${ROUTE.UPDATE_POST}/:id`} element={<EditPost />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTE.USER_PROFILE} element={<ProfilePage />} />
        <Route path={ROUTE.MY_ADS} element={<MyAds />} />
        <Route path={ROUTE.WISHLIST} element={<MyWishlist />} />
        <Route path={ROUTE.NOTIFICATIONS} element={<Notifictions />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
