import React, { useState } from "react";
import filterIcon from "../../assets/icon/filterIcon.svg";
import gridIcon from "../../assets/icon/gridIcon.svg";
import listIcon from "../../assets/icon/listIcon.svg";
import { useTranslation } from "react-i18next";
import { FilterModal } from "./FilterModal";

export const SearchTopFilter = ({ categories, toggleGrid, setToggleGrid }) => {
  const { t } = useTranslation();
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filters, setFilters] = useState({});

  console.log("filters", filters);

  return (
    <div className="pt-15">
      <div className="text-sm text-gray-500 mb-2">
        {t("home")} <span className="mx-1">{">"}</span> {t("searchButton")}
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="main-heading">{t("buySell")}</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setOpenFilterModal(true)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <img src={filterIcon} alt="Filter" className="w-5 h-5" />
          </button>
          <button
            onClick={() => setToggleGrid(!toggleGrid)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <img
              src={toggleGrid ? gridIcon : listIcon}
              alt="Grid"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((cat, i) => (
          <button
            key={i}
            className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition"
          >
            {cat}
          </button>
        ))}
      </div>

      <FilterModal
        isOpen={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        onApply={(values) => {
          setFilters(values);
          setOpenFilterModal(false);
        }}
      />
    </div>
  );
};
