import React, { useEffect, useState } from "react";
import defaultUser from "../../../assets/icon/defaultUser.svg";
import RatingStar from "../../../common/ratingStar/RatingStar";
import { useTranslation } from "react-i18next";
import { EditProfile } from "../../../components/profilePage/EditProfile";
import RatingSummary from "../../../components/sellerProfile/RatingSummary";
import { SellerReviews } from "../../../components/sellerProfile/SellerReviews";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { ScreenLoader } from "../../../utils/screenLoader";
import { deleteRequest, getRequest } from "../../../config/apiFunctions";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import { CUSTOMER } from "../../../config/endPoints";
import { logout } from "../../../redux/slices/authSlice";
import { clearUser } from "../../../redux/slices/userSlice";
import { ROUTE } from "../../../config/constants";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const { userInfo } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("editProfile");
  const [loading, setLoading] = useState(false);
  const [reviewsList, setReviewsList] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const tabs = [
    { id: "editProfile", label: t("editProfile") },
    { id: "reviews", label: t("ratingReviews") },
  ];

  const handleDeleteAccount = async () => {
    setLoadingDelete(true);
    try {
      const res = await deleteRequest(CUSTOMER.DELETE_ACCOUNT);
      if (res?.data?.statusCode === 200) {
        showSuccessToast(res?.data?.message);
        setShowDeleteModal(true);
        dispatch(logout());
        dispatch(clearUser());
        navigate(ROUTE.ROOT);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const getReviewsData = async (url) => {
    setLoading(true);
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setReviewsList(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
  };

  const getReviewsCallback = () => {
    getReviewsData(CUSTOMER.GET_REVIEWS);
  };

  useEffect(() => {
    getReviewsCallback();
  }, []);

  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviewsList?.ratingsBreakdown?.forEach((item) => {
    breakdown[item.rating] = item.count;
  });

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
        <div className="lg:p-5">
          <h1 className="main-heading">{t("myProfile")}</h1>
          <div className="md:py-10 pt-5 pb-10">
            <div className="relative flex flex-wrap justify-between gap-8 bg-white shadow-md rounded-2xl p-4 w-full">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-8">
                  <img
                    src={
                      userInfo?.user_profile_url
                        ? `${imagePath}/${userInfo.user_profile_url}`
                        : defaultUser
                    }
                    alt="userImg"
                    className="h-full lg:w-60 lg:h-45 rounded-lg object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold pb-3">
                    {userInfo?.username || t("hello")}
                  </h3>
                  {reviewsList && (
                    <div className="flex gap-3">
                      <RatingStar
                        starValue={
                          reviewsList?.averageRating
                            ? reviewsList?.averageRating
                            : 0
                        }
                      />{" "}
                      {reviewsList?.averageRating && (
                        <p>({Number(reviewsList?.averageRating).toFixed(1)})</p>
                      )}
                    </div>
                  )}
                  <p className="text-base text-[#808080] pt-7">
                    {t("memberSince")}{" "}
                    {moment(userInfo?.created_at).format("MM/DD/YYYY")}
                  </p>
                </div>
              </div>
              <div>
                <p
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-100 rounded-md py-0.5 px-2 text-red-500 cursor-pointer hover:bg-red-200 hover:text-red-600 transition"
                >
                  {t("deleteAccount")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex">
            {tabs.map((tab) => (
              <p
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative cursor-pointer pb-2 px-4 md:px-10 text-sm md:text-lg font-semibold  transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute left-0 -bottom-[1px] h-[1px] w-full rounded-full transition-colors ${
                    activeTab === tab.id ? "bg-primary h-[2px]" : "bg-gray-300"
                  }`}
                />
              </p>
            ))}
          </div>

          {activeTab === "editProfile" && (
            <EditProfile
              userInfo={userInfo}
              imagePath={imagePath}
              setContentLoading={setLoading}
            />
          )}
          {activeTab === "reviews" && (
            <div className="pt-4">
              <h3 className="font-bold text-2xl py-6">{t("ratingReviews")}</h3>

              {reviewsList?.reviews?.length ? (
                <>
                  <div className="border-b-2 border-gray-200 pb-4">
                    <RatingSummary
                      average={reviewsList?.averageRating}
                      totalReviews={reviewsList?.count}
                      breakdown={breakdown}
                    />
                  </div>
                  <div className="pt-4">
                    <SellerReviews
                      sellerReviews={reviewsList?.reviews}
                      imagePath={imagePath}
                    />
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center text-lg pt-4">
                  {t("noDataFound")}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className=" flex flex-col items-center justify-center py-6">
              <h3 className="font-bold text-xl pb-2">{t("deleteAccTitle")}</h3>
              <p className="text-sm text-gray-500 pb-6">
                {t("deleteAccSubtitle")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={loadingDelete}
                className="w-full bg-red-400 h-[50px] text-white hover:bg-red-500 transition rounded font-medium"
              >
                {loadingDelete ? t("deleting") : t("delete")}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full bg-primary h-[50px] text-white hover:bg-primaryDark transition rounded font-medium"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
