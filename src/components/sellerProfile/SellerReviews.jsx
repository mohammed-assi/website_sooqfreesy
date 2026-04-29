import React, { useState } from "react";
import defaultUser from "../../assets/icon/defaultUser.svg";
import RatingStar from "../../common/ratingStar/RatingStar";
import { useTranslation } from "react-i18next";

export const SellerReviews = ({ sellerReviews, imagePath }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-2 capitalize">{t("reviewss")}</h2>
      {sellerReviews?.length > 0 ? (
        sellerReviews.map((item, i) => (
          <ReviewItem key={i} item={item} imagePath={imagePath} />
        ))
      ) : (
        <p className="text-center text-gray-500 font-medium py-6">
          {t("noReviewsFound")}
        </p>
      )}
    </div>
  );
};

const ReviewItem = ({ item, imagePath }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const text = item.review_text || "";
  const shouldTruncate = text.length > 200;
  const displayText = expanded ? text : text.slice(0, 200);

  return (
    <div className="py-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              item.user_profile_url
                ? `${imagePath}/${item.user_profile_url}`
                : defaultUser
            }
            alt="userImg"
            className="h-15 w-15 object-cover rounded-full"
          />
          <h4 className="font-semibold text-lg">{item.username}</h4>
        </div>
        <RatingStar starValue={Number(item.rating)} />
      </div>

      <p className="text-gray-500 py-2">
        {displayText}
        {/* {shouldTruncate && !expanded && "..."} */}
      </p>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-primary text-sm font-medium"
        >
          {expanded ? t("readLess") : t("readMore")}
        </button>
      )}
    </div>
  );
};
