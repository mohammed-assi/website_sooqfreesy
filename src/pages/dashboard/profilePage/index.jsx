import React, { useState } from "react";
import defaultUser from "../../../assets/icon/defaultUser.svg";
import RatingStar from "../../../common/ratingStar/RatingStar";
import { useTranslation } from "react-i18next";
import { EditProfile } from "../../../components/profilePage/EditProfile";
import RatingSummary from "../../../components/sellerProfile/RatingSummary";
import { SellerReviews } from "../../../components/sellerProfile/SellerReviews";
import { useSelector } from "react-redux";
import moment from "moment/moment";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const { userInfo } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("editProfile");

  const tabs = [
    { id: "editProfile", label: t("editProfile") },
    { id: "reviews", label: t("ratingReviews") },
  ];

  const breakdown = {
    5: 80,
    4: 20,
    3: 10,
    2: 5,
    1: 5,
  };

  return (
    <div className="p-5">
      <h1 className="main-heading">{t("myProfile")}</h1>
      <div className="py-10">
        <div className="relative flex items-center justify-between bg-white shadow-md rounded-2xl p-4 w-full">
          <div className="flex items-center gap-8">
            <img
              src={
                userInfo?.user_profile_url
                  ? `${imagePath}/${userInfo.user_profile_url}`
                  : defaultUser
              }
              alt="userImg"
              className="w-60 h-45 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-2xl font-bold pb-3">{userInfo?.username}</h3>
              <RatingStar starValue={4.5} />
              <p className="text-base text-[#808080] pt-7">
                {t("memberSince")}{" "}
                {moment(userInfo?.created_at).format("MM/DD/YYYY")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {tabs.map((tab) => (
          <p
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative cursor-pointer pb-2 px-10 text-lg font-semibold  transition-colors ${
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

      {activeTab === "editProfile" && <EditProfile userInfo={userInfo} imagePath={imagePath} />}
      {activeTab === "reviews" && (
        <div className="pt-4">
          <h3 className="font-bold text-2xl py-6">{t("ratingReviews")}</h3>
          <div className="border-b-2 border-gray-200 pb-4">
            <RatingSummary
              average={4.5}
              totalReviews={120}
              breakdown={breakdown}
            />
          </div>
          <div className="pt-4">
            <SellerReviews />
          </div>
        </div>
      )}
    </div>
  );
};
