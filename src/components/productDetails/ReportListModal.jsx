import React, { useState } from "react";
import { InfoModal } from "../../common/modal/InfoModal";
import { useTranslation } from "react-i18next";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { postRequest } from "../../config/apiFunctions";
import { REPORT_LIST } from "../../config/endPoints";

export const ReportListModal = ({ onClose, reportList, postDetailData }) => {
  const { i18n, t } = useTranslation();
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleSelect = async (id) => {
    const payload = {
      listing_id: postDetailData?.id,
      reportListing_id: id,
    };

    try {
      const response = await postRequest(REPORT_LIST.REPORT_POST, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        setShowInfoModal(true);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
          <button
            onClick={onClose}
            className={`absolute top-4 text-gray-400 hover:text-gray-600 ${
              i18n.language === "ar" ? "left-6" : "right-6"
            }`}
          >
            <i className="fa-solid fa-xmark fa-lg" />
          </button>

          <h2 className="text-xl font-bold mb-4">{t("reportListing")}</h2>

          <ul className="space-y-2">
            {reportList?.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`text-gray-600 flex items-center justify-between cursor-pointer px-2 py-1 hover:text-black border-b border-gray-100`}
              >
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showInfoModal && (
        <InfoModal
          onClose={() => {
            setShowInfoModal(false);
            onClose();
          }}
          title={t("reported")}
          subtitle={t("informationReported")}
        />
      )}
    </>
  );
};
