import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ProductListCard from "../searchPage/ProductListCard";
import { SideFilter } from "../searchPage/SideFilter";
import filterIcon from "../../assets/icon/filterIcon.svg";
import { FilterModal } from "../searchPage/FilterModal";
import { SellerReviews } from "./SellerReviews";
import RatingSummary from "./RatingSummary";

export const ListingFilter = ({
  sellerReviews,
  imagePath,
  allCategory,
  handleChange,
  filters,
  setModalFilter,
  allPosts,
  handleLikeUnlikePost,
  setSearchTextDebounce,
  searchTextDebounce,
  states,
  selectedState,
  setSelectedState,
  cities,
  selectedCity,
  setSelectedCity,
  setSelectedLocation,
  setCoords,
  selectedLocation,
  subCategoryList,
  handleApplyFilters,
  handleResetFilters,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("listing");
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const tabs = [
    { id: "listing", label: `${t("listing")} (${allPosts?.length})` },
    { id: "reviews", label: t("reviewss") },
  ];

  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  sellerReviews?.ratingsBreakdown?.forEach((item) => {
    breakdown[item.rating] = item.count;
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="flex">
          {tabs.map((tab) => (
            <p
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative cursor-pointer pb-2 px-4 md:px-10 text-sm md:text-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {tab.label}
              <span
                className={`absolute left-0 -bottom-[1px] h-[1px] w-full rounded-full transition-colors ${
                  activeTab === tab.id ? "bg-primary h-[2px]" : "bg-gray-300"
                }`}
              />
            </p>
          ))}
        </div>
        {activeTab === "listing" && (
          <div className="flex gap-3 items-center">
            <p className="text-lg text-gray-600 hidden md:block">{t("sorting")}</p>
            <button
              onClick={() => setOpenFilterModal(true)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <img src={filterIcon} alt="Filter" className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="pt-8">
        {activeTab === "listing" && (
          <>
            <div className="flex justify-between items-center mb-5 px-2 lg:hidden">
              <h2 className="text-lg font-semibold"></h2>
              <button
                onClick={() => setShowFilter(true)}
                className="flex items-center gap-2 text-primary font-semibold"
              >
                <i className="fa-solid fa-bars-filter size-4" />
                {t("filters")}
              </button>
            </div>

            {showFilter && (
              <div
                className="fixed inset-0 z-50 bg-black/40 flex items-end justify-end"
                onClick={() => setShowFilter(false)}
              >
                <div
                  className="w-full sm:w-[400px] h-[75%] bg-white p-4 overflow-y-auto shadow-lg rounded-t-xl bottom-0 left-0 animate-slide-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{t("filters")}</h2>
                    <button onClick={() => setShowFilter(false)}>
                      <i className="fa-solid fa-xmark size-5" />
                    </button>
                  </div>
                  <SideFilter
                    allCategory={allCategory}
                    handleChange={handleChange}
                    filters={filters}
                    searchTextDebounce={searchTextDebounce}
                    states={states}
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
                    cities={cities}
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                    setSelectedLocation={setSelectedLocation}
                    setCoords={setCoords}
                    selectedLocation={selectedLocation}
                    subCategoryList={subCategoryList}
                    handleResetFilters={handleResetFilters}
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="hidden lg:block">
                <SideFilter
                  allCategory={allCategory}
                  handleChange={handleChange}
                  filters={filters}
                  setSearchTextDebounce={setSearchTextDebounce}
                  searchTextDebounce={searchTextDebounce}
                  states={states}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  cities={cities}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  setSelectedLocation={setSelectedLocation}
                  setCoords={setCoords}
                  selectedLocation={selectedLocation}
                  subCategoryList={subCategoryList}
                  handleResetFilters={handleResetFilters}
                />
              </div>
              <div className="lg:col-span-3">
                {allPosts?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {allPosts?.map((item) => (
                      <ProductListCard
                        key={item.id}
                        item={item}
                        imagePath={imagePath}
                        handleLikeUnlikePost={handleLikeUnlikePost}
                        showWishlist={true}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600">
                    {t("noDataFound")}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-6">
            <aside className="space-y-6">
              <RatingSummary
                average={sellerReviews?.averageRating}
                totalReviews={sellerReviews?.count}
                breakdown={breakdown}
              />
            </aside>

            <div>
              <SellerReviews
                sellerReviews={sellerReviews?.reviews}
                imagePath={imagePath}
              />
            </div>
          </div>
        )}
      </div>
      <FilterModal
        isOpen={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        onApply={(values) => {
          setModalFilter(values);
          setOpenFilterModal(false);
        }}
        handleApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
