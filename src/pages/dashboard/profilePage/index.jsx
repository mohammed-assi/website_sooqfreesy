import React, { useEffect, useState } from "react";
import defaultUser from "../../../assets/icon/defaultUser.svg";
import RatingStar from "../../../common/ratingStar/RatingStar";
import { useTranslation } from "react-i18next";
import { EditProfile } from "../../../components/profilePage/EditProfile";
import RatingSummary from "../../../components/sellerProfile/RatingSummary";
import { SellerReviews } from "../../../components/sellerProfile/SellerReviews";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import { ScreenLoader } from "../../../utils/screenLoader";
import { getRequest } from "../../../config/apiFunctions";
import { showErrorToast } from "../../../utils/toastUtils";
import { CUSTOMER } from "../../../config/endPoints";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const { userInfo } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("editProfile");
  const [loading, setLoading] = useState(false);
  const [reviewsList, setReviewsList] = useState({});

  const tabs = [
    { id: "editProfile", label: t("editProfile") },
    { id: "reviews", label: t("ratingReviews") },
  ];

  // const breakdown = {
  //   5: 80,
  //   4: 20,
  //   3: 10,
  //   2: 5,
  //   1: 5,
  // };

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
          <div className="py-10">
            <div className="relative flex flex-wrap items-center gap-8 bg-white shadow-md rounded-2xl p-4 w-full">
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
                  {reviewsList?.averageRating && (
                    <div className="flex gap-3">
                      <RatingStar starValue={reviewsList?.averageRating} />{" "}
                      <p>({reviewsList?.averageRating})</p>
                    </div>
                  )}
                  <p className="text-base text-[#808080] pt-7">
                    {t("memberSince")}{" "}
                    {moment(userInfo?.created_at).format("MM/DD/YYYY")}
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
    </>
  );
};
