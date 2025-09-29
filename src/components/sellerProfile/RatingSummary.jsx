import React from "react";
import RatingStar from "../../common/ratingStar/RatingStar";
import { useTranslation } from "react-i18next";

const RatingSummary = ({ average, totalReviews, breakdown }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-2">
        {t("ratings")}{" "}
        <span className="text-sm text-gray-500 mb-6">
          ({t("basedOn")} {totalReviews} {t("reviews")})
        </span>
      </h2>

      <div className="flex items-center gap-6 py-3">
        <div className="text-center">
          <p className="text-[56px] font-bold">
            {average ? Number(average).toFixed(1) : 0}
          </p>
          <RatingStar starValue={average} />
        </div>

        <div className="flex-1 space-y-2">
          {Object.keys(breakdown)
            .sort((a, b) => b - a)
            .map((star) => {
              const count = breakdown[star] || 0;
              const percentage = totalReviews > 0 ? (count / 100) * 100 : 0;

              let barColor = "bg-gray-200";
              if (star === "5") barColor = "bg-cyan-500";
              if (star === "4") barColor = "bg-cyan-300";
              if (star === "3") barColor = "bg-orange-400";
              if (star === "2") barColor = "bg-orange-500";
              if (star === "1") barColor = "bg-red-500";

              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-4 text-sm">{star}</span>
                  <div className="flex-1 bg-gray-100 rounded h-5">
                    <div
                      className={`${barColor} h-5 rounded`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
