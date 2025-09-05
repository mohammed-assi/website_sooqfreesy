import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import defaultUser from "../../assets/icon/defaultUser.svg";
import RatingStar from "../../common/ratingStar/RatingStar";
import headerContact from "../../assets/icon/headerContact.svg";
import menu from "../../assets/icon/menu.svg";
import reportUser from "../../assets/icon/reportUser.svg";
import ReportListModal from "../../components/sellerProfile/ReportListModal";

export const SellerProfile = () => {
  const { t } = useTranslation();
  const [showReportButton, setShowReportButton] = useState(false);
  const [showReportListModal, setShowReportListModal] = useState(false);
  return (
    <>
      <div className="spacer-x">
        <div className="pt-15">
          <div className="text-sm text-gray-500 mb-2">
            {t("home")} <span className="mx-1">{">"}</span> Search
            <span className="mx-1">{">"}</span> Product Details{" "}
            <span className="mx-1">{">"}</span> Seller Profile
          </div>

          <h1 className="main-heading">Seller Profile</h1>

          <div className="py-10">
            <div className="relative flex items-center justify-between bg-white shadow-md rounded-2xl p-4 w-full">
              <div className="flex items-center gap-4">
                <img
                  src={defaultUser}
                  alt="userImg"
                  className="w-60 h-45 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold pb-1">Anwar Ali</h3>
                  <RatingStar starValue={4.5} />
                  <p className="text-sm text-gray-500 pt-5">
                    Member since 14/01/2025
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex gap-2 font-bold items-center px-6 py-3 bg-primary rounded-lg text-white hover:bg-primaryDark cursor-pointer transition">
                  <img src={headerContact} alt="icon" className="h-5 w-5" />{" "}
                  9876543210
                </button>

                <div className="absolute top-5 right-4">
                  <button
                    onClick={() => setShowReportButton(!showReportButton)}
                    className="text-gray-700"
                  >
                    <img src={menu} alt="userImg" className="w-6 h-6" />
                  </button>
                </div>
                {showReportButton && (
                  <div className="absolute top-12 right-4 z-10">
                    <button
                      onClick={() => setShowReportListModal(true)}
                      className="rounded-md shadow-md text-gray-700 p-4 flex items-center gap-2"
                    >
                      <img src={reportUser} alt="userImg" className="w-6 h-6" />
                      Report Seller
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReportListModal && (
        <ReportListModal
          isOpen={showReportListModal}
          onClose={() => setShowReportListModal(false)}
          setShowReportButton={setShowReportButton}
        />
      )}
    </>
  );
};
