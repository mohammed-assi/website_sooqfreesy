import React from "react";
import landlord from "../../assets/icon/landlord.svg";
import agent from "../../assets/icon/agent.svg";
import { useTranslation } from "react-i18next";

export const ChoodeLandlordAgent = ({
  handleChooseLandlordAgent,
  categoryData,
}) => {
  const { t } = useTranslation();

  return (
    <div className="py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => handleChooseLandlordAgent(1)}
          className="cursor-pointer"
        >
          <div className="p-3 border-2 border-gray-200 rounded-lg h-70 flex flex-col justify-center items-center hover:border-primary transition">
            <img src={landlord} alt="icon" className="h-20 w-20 rounded-lg" />
            <h3 className="text-center pt-4 font-bold text-xl">
              {categoryData?.name === "Real Estate"
                ? t("landlord")
                : t("owner")}
            </h3>
          </div>
        </div>
        <div
          onClick={() => handleChooseLandlordAgent(2)}
          className="cursor-pointer"
        >
          <div className="p-3 border-2 border-gray-200 rounded-lg h-70 flex flex-col justify-center items-center hover:border-primary transition">
            <img src={agent} alt="icon" className="h-20 w-20 rounded-lg" />
            <h3 className="text-center pt-4 font-bold text-xl">{t("agent")}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
