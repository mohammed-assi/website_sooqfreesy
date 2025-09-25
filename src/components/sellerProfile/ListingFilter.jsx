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
  setSearchTextDebounce
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("listing");
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const tabs = [
    { id: "listing", label: `${t("listing")} (${allPosts?.length})` },
    { id: "reviews", label: t("reviewss") },
  ];

  const breakdown = {
    5: 80,
    4: 20,
    3: 10,
    2: 5,
    1: 5,
  };

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
            <p className="text-lg text-gray-600">{t("sorting")}</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <SideFilter
              allCategory={allCategory}
              handleChange={handleChange}
              filters={filters}
              setSearchTextDebounce={setSearchTextDebounce}
            />
            <div className="lg:col-span-3">
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
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-6">
            <aside className="space-y-6">
              <RatingSummary
                average={4.5}
                totalReviews={120}
                breakdown={breakdown}
              />
            </aside>

            <div>
              <SellerReviews
                sellerReviews={sellerReviews}
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
      />
    </div>
  );
};
