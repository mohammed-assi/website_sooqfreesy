import React, { useMemo, useState } from "react";
import bannerLeft from "../../assets/image/bannerLeft.png";
import bannerRight from "../../assets/image/bannerRight.png";
import { useTranslation } from "react-i18next";
import estate from "../../assets/icon/estate.svg";
import vehicle from "../../assets/icon/vehicle.svg";
import other from "../../assets/icon/other.svg";
import { ROUTE } from "../../config/constants";
import { Link, useNavigate } from "react-router-dom";

export const Banner = ({ allCategory }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  // const categories = [
  //   {
  //     id: 1,
  //     name: t("realEstate"),
  //     icon: estate,
  //     categoryName: "Real estate",
  //   },
  //   {
  //     id: 2,
  //     name: t("vehicle"),
  //     icon: vehicle,
  //     categoryName: "Vehicle",
  //   },
  //   {
  //     id: 3,
  //     name: t("others"),
  //     icon: other,
  //     categoryName: "Other",
  //   },
  // ];

const iconMap = {
  13: estate, // Real estate
  3: vehicle, // Vehicle
  2: other,   // Other
};

const allowedCategoryIds = [13, 3, 2];

const categories = useMemo(() => {
  if (!allCategory?.length) return [];

  return allCategory
    .filter((cat) => allowedCategoryIds.includes(cat.id)) // only 3 categories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: iconMap[cat.id] || other,
      categoryName: cat.name,
    }));
}, [allCategory]);

  const [searchValue, setSearchValue] = useState("");

  const goToProductPage = () => {
    if (searchValue !== "") {
      navigate(ROUTE.PRODUCT_PAGE, { state: { searchText: searchValue } });
    } else {
      navigate(ROUTE.PRODUCT_PAGE);
    }
  };

  console.log("allCategory", allCategory);
  return (
    <div
      // dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className="relative flex text-center items-center justify-center min-h-150 py-17 bg-gradient-to-r from-orange-100 to-blue-100"
    >
      <div className="absolute bottom-0 start-0 hidden md:block">
        <img src={bannerLeft} alt="imageee" />
      </div>

      <div className="absolute bottom-0 end-0 hidden md:block">
        <img src={bannerRight} alt="imageee" className="object-contain" />
      </div>

      <div className="w-150 relative z-10 px-3">
        <h1 className="font-bold text-3xl md:text-4xl lg:text-heading">
          {t("homeBannerHeading")}
        </h1>

        <div className="my-8 shadow-md  flex justify-between">
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

        <h3 className="font-semibold text-subHeading">
          {t("homeBannerSubheading")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 mt-6">
          {categories.map((category) => (
            <button
              onClick={() => {
                navigate(ROUTE.PRODUCT_PAGE, {
                  state: { categoryName: category?.categoryName },
                });
              }}
              key={category.id}
              className="flex flex-col items-center justify-center border bg-white border-gray-300 rounded-xl p-6 hover:shadow-lg hover:border-none transition group"
            >
              <img
                src={category.icon}
                alt={category.name}
                className="w-12 h-12 mb-3 group-hover:scale-110 transition"
              />
              <p className="font-medium">{category.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
