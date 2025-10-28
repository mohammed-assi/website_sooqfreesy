import { useTranslation } from "react-i18next";
import { ProductCard } from "../../common/card/ProductCard";
import Pagination from "../../common/pagination";
import ProductListCard from "./ProductListCard";
import { SideFilter } from "./SideFilter";
import { useState } from "react";

export default function ProductFilter({
  toggleGrid,
  allPosts,
  imagePath,
  currentPage,
  setCurrentPage,
  totalPages,
  allCategory,
  handleChange,
  filters,
  handleLikeUnlikePost,
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
  handleResetFilters,
}) {
  const { t } = useTranslation();

  const [showFilter, setShowFilter] = useState(false);
  return (
    <div className="pt-8 pb-15">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="hidden lg:block">
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

        <main className="lg:col-span-3">
          {allPosts?.length === 0 ? (
            <p className="text-gray-500 text-center text-lg pt-4">
              {t("noDataFound")}
            </p>
          ) : !toggleGrid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts?.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  imagePath={imagePath}
                  handleLikeUnlikePost={handleLikeUnlikePost}
                />
              ))}
            </div>
          ) : (
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
          )}

          {allPosts?.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
