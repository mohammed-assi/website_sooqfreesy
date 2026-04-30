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


  // ✅ check if scroll needed
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

  return (
    <div className="pt-4 md:pt-6" >

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
            className="p-2 rounded hover:bg-gray-100 "
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

      {/* 🔥 CATEGORY SLIDER */}
      { (
        <div className="relative  p-[15px]">

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
              <div className="flex gap-8 mx-auto w-max">
            {categories.map((cat) => {
              const isActive = subcategoryIds.includes(cat.id);

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectSubcatIds(cat.id)}
                  className={`
                      px-9 py-3 rounded-full whitespace-nowrap transition-all duration-300 transform
                      ${
                        isActive
                          ? "bg-primary text-white text-base font-bold "
                          : "border-bg-primary shadow-primary/40 shadow-md  bg-white text-gray-700 text-base font-bold hover:bg-primary hover:text-white hover:-translate-y-1"
                      }
                    `}
                >
                  {cat.name}
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


