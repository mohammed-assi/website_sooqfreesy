import React, { useState } from "react";
import filterIcon from "../../assets/icon/filterIcon.svg";
import gridIcon from "../../assets/icon/gridIcon.svg";
import listIcon from "../../assets/icon/listIcon.svg";
import { useTranslation } from "react-i18next";
import { FilterModal } from "./FilterModal";
import { Link } from "react-router-dom";
import { ROUTE } from "../../config/constants";
import { useSelector } from "react-redux";

export const SearchTopFilter = ({
  categories,
  toggleGrid,
  setToggleGrid,
  handleSelectSubcatIds,
  subcategoryIds,
  setFiltersModal,
  searchText,
  filters,
  handleApplyFilters,
  filtersModal,
}) => {
  const { t } = useTranslation();
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const reduxCoords = useSelector((state) => state.location.coords);

  return (
    <div className="pt-10 md:pt-15">
      <div className="text-sm text-gray-500 mb-2">
        <Link className="hover:text-primary" to={ROUTE.ROOT}>
          {t("home")}
        </Link>{" "}
        <span className="mx-1">{">"}</span>{" "}
        {searchText !== "" ? t("searchButton") : t("products")}
      </div>

      <div className="flex items-center justify-between md:mb-6">
        <h1 className="main-heading">
          {t("buySell")}{" "}
          {reduxCoords?.country ? `${t("in")} ${reduxCoords?.country}` : ""}
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setOpenFilterModal(true)}
            className="p-2 rounded hover:bg-gray-100 shrink-0"
          >
            <img src={filterIcon} alt="Filter" className="w-5 h-5" />
          </button>
          <button
            onClick={() => setToggleGrid(!toggleGrid)}
            className="p-2 rounded hover:bg-gray-100 hidden md:block"
          >
            <img
              src={toggleGrid ? gridIcon : listIcon}
              alt="Grid"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>

      {!filters?.category && (
        <div className="flex flex-wrap gap-1 md:gap-3">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => handleSelectSubcatIds(cat.id)}
              className={`px-2 py-1 md:px-4 text-xs md:py-2 rounded-full md:rounded-md md:text-sm transition ${
                subcategoryIds.includes(cat.id)
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <FilterModal
        isOpen={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        onApply={(values) => {
          setFiltersModal(values);
          setOpenFilterModal(false);
        }}
        handleApplyFilters={handleApplyFilters}
        initialFilters={filtersModal}
      />
    </div>
  );
};
