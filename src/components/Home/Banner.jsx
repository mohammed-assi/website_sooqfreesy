import React, { useState } from "react";
// import bannerLeft from "../../assets/image/bannerLeft.png";
// import bannerRight from "../../assets/image/bannerRight.png";
import { useTranslation } from "react-i18next";
// import estate from "../../assets/icon/estate.svg";
// import vehicle from "../../assets/icon/vehicle.svg";
// import other from "../../assets/icon/other.svg";
import { ROUTE } from "../../config/constants";
import { useNavigate } from "react-router-dom";

export const Banner = ({ allCategory, imagePath }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");

  const goToProductPage = () => {
    if (searchValue !== "") {
      navigate(ROUTE.PRODUCT_PAGE, { state: { search: searchValue } });
    } else {
      navigate(ROUTE.PRODUCT_PAGE);
    }
  };

  return (
    <div
      // dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className="relative flex flex-col md:flex-row text-center items-center justify-center lg:min-h-150 md:py-17 py-10 bg-gradient-to-r from-orange-100 to-blue-100"
    >
      {/* <div className="absolute bottom-0 start-0 hidden md:block">
        <img src={bannerLeft} alt="imageee" />
      </div>

      <div className="absolute bottom-0 end-0 hidden md:block">
        <img src={bannerRight} alt="imageee" className="object-contain" />
      </div> */}

      <div className="w-full max-w-150 relative z-10 px-4 md:px-3">
        <h1 className="font-bold text-2xl md:text-4xl lg:text-heading">
          {t("homeBannerHeading")}
        </h1>

        <div className="md:my-8 my-6 shadow-md flex justify-between">
          <input
            type="text"
            placeholder={t("bannerSearchPlaceHolder")}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-none bg-white rounded focus:outline-none w-full p-3"
          />
          <button
            onClick={goToProductPage}
            className={`flex gap-3 items-center text-white bg-primary px-3 cursor-pointer ${
              i18n.language === "ar"
                ? "rounded-tl rounded-bl flex-row-reverse"
                : "rounded-tr rounded-br"
            }`}
          >
            <i className="fa-regular fa-magnifying-glass" />
            {t("searchButton")}
          </button>
        </div>

        <h3 className="font-semibold md:text-subHeading">
          {t("homeBannerSubheading")}
        </h3>

        <div className="flex flex-nowrap justify-center gap-4 md:gap-6 px-3 md:px-6 mt-6 overflow-x-auto">
          {allCategory?.map((category) => (
            <button
              onClick={() => {
                navigate(`${ROUTE.PRODUCT_PAGE}?category=${category?.id}`);
              }}
              key={category.id}
              className="flex flex-col items-center justify-center shrink-0 w-20 md:w-auto md:flex-1 border bg-white border-gray-300 rounded-lg md:rounded-xl p-2.5 md:p-6 hover:shadow-lg hover:border-none transition group"
            >
              <img
                src={`${imagePath}/${category?.image_url}`}
                alt={category.name}
                className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 group-hover:scale-110 transition"
              />
              <p className="text-xs md:text-base font-medium">{category.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
