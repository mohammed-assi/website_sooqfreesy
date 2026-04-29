import React from "react";
import { useTranslation } from "react-i18next";

export const ChooseRentSale = ({
  categoryData,
  imagePath,
  handleChooseRentSale,
}) => {
  const { t } = useTranslation();
  return (
    <div className="py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div onClick={() => handleChooseRentSale(1)} className="cursor-pointer">
          <div className="p-3 border border-gray-200 rounded-lg h-70">
            <img
              src={`${imagePath}/${categoryData.image_url}`}
              alt={categoryData.name}
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
          <h3 className="text-center pt-4 font-bold text-xl">
            {categoryData.name}{" "}
            {t("forSale")}
          </h3>
        </div>
        <div onClick={() => handleChooseRentSale(2)} className="cursor-pointer">
          <div className="p-3 border border-gray-200 rounded-lg h-70">
            <img
              src={`${imagePath}/${categoryData.image_url}`}
              alt={categoryData.name}
              className="h-full w-full object-contain rounded-lg"
            />
          </div>
          <h3 className="text-center pt-4 font-bold text-xl">
            {categoryData.name}{" "}
            {t("forRent")}
          </h3>
        </div>
      </div>
    </div>
  );
};
