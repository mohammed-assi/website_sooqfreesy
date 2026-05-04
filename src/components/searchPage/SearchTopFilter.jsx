import React, { useState, useRef, useEffect } from "react";
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
  imagePath,
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
  const itemRefs = useRef({});
  const scrollRef = useRef(null);
  const [canScroll, setCanScroll] = useState(false);

  const scroll = (dir) => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const currentScroll = el.scrollLeft;
      const progress = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!subcategoryIds) return;

    const el = itemRefs.current[subcategoryIds];
    const container = scrollRef.current;

    if (el && container) {
      const elLeft = el.offsetLeft;
      const elWidth = el.offsetWidth;
      const containerWidth = container.clientWidth;

      container.scrollTo({
        left: elLeft - containerWidth / 2 + elWidth / 2,
        behavior: "smooth",
      });
    }
  }, [subcategoryIds]);

  // check if scroll needed
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      setCanScroll(el.scrollWidth > el.clientWidth);
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  const formatName = React.useCallback((name = "", maxLength = 12, showChars = 6) => {
    if (!name) return "";
    return name.length > maxLength ? name.slice(0, showChars) + "..." : name;
  }, []);

  return (
    <div className="pt-4 md:pt-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">
        <Link className="hover:text-primary" to={ROUTE.ROOT}>
          {t("home")}
        </Link>{" "}
        <span className="mx-1">{">"}</span>{" "}
        {searchText !== "" ? t("searchButton") : t("products")}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="main-heading">
          {t("buySell")}{" "}
          {reduxCoords?.country ? `${t("in")} ${reduxCoords?.country}` : ""}
        </h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenFilterModal(true)}
            className="p-2 rounded hover:bg-gray-100"
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

      {/* CATEGORY SLIDER */}
      {(
        <div className="relative p-[15px]">
          {/* LEFT ARROW */}
          {canScroll && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-10
              bg-white text-primary w-8 h-8 rounded-full shadow-md hover:scale-105 transition"
            >
              ◀
            </button>
          )}

          {/* SLIDER */}
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto whitespace-nowrap py-2 px-2 md:px-8 scroll-smooth custom-scrollbar"
          >
            <div className="flex gap-5 mx-auto w-max">
              {categories.map((cat) => {
                const isActive = subcategoryIds === cat.id;

                return (
                  <button
                    onClick={() => handleSelectSubcatIds(cat.id)}
                    className="group px-4 py-2 flex flex-col items-center gap-1 transition-all duration-300"
                  >
                    {/* IMAGE */}
                    <div
                      className={`
                        w-18 h-18 md:w-20 md:h-20 rounded-full overflow-hidden border-6 transition-all duration-300
                        ${isActive ? "border-primary" : "border-transparent group-hover:border-primary"}
                      `}
                    >
                      <img
                        src={`${imagePath}/${cat.icon || cat.image_url}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* TEXT */}
                    <span
                    className={`
                      text-center transition-all duration-300
                      text-base md:text-lg
                      ${isActive
                        ? "text-primary font-semibold scale-110"
                        : "text-gray-700 group-hover:text-primary group-hover:scale-115"}
                    `}
                  >
                    {formatName(cat.name, 12, 6)}
                  </span>

                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT ARROW */}
          {canScroll && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-10
              bg-white text-primary w-8 h-8 rounded-full shadow-md hover:scale-105 transition"
            >
              ▶
            </button>
          )}
        </div>
      )}

      {/* FILTER MODAL */}
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