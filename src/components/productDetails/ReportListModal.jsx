import React, { useState } from "react";
import { InfoModal } from "../../common/modal/InfoModal";
import { useTranslation } from "react-i18next";

export const ReportListModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [report, setReport] = useState("");

  const cities = [
    { value: "Listing Sold", label: "Listing Sold" },
    { value: "Incorrect Category", label: "Incorrect Category" },
    { value: "Incorrect Price", label: "Incorrect Price" },
    { value: "Incorrect Image", label: "Incorrect Image" },
    { value: "Duplicate Listing", label: "Duplicate Listing" },
    { value: "Inappropriate Listing", label: "Inappropriate Listing" },
    { value: "Fraud", label: "Fraud" },
  ];

  const handleSelect = (report) => {
    setReport(report);
    setShowInfoModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-6 text-gray-400 hover:text-gray-600"
          >
            <i className="fa-solid fa-xmark fa-lg" />
          </button>

          <h2 className="text-xl font-bold mb-4">{t("reportListing")}</h2>

          <ul className="space-y-2">
            {cities.map((city) => (
              <li
                key={city.value}
                onClick={() => handleSelect(city)}
                className={`${
                  report.value === city.value
                    ? "text-black font-medium"
                    : "text-gray-600"
                } flex items-center justify-between cursor-pointer px-2 py-1 hover:text-black border-b border-gray-100`}
              >
                <span>{city.label}</span>
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
