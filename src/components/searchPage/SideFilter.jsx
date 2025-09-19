import { useTranslation } from "react-i18next";

export const SideFilter = ({ allCategory, filters, handleChange }) => {
  const { i18n, t } = useTranslation();

  return (
    <aside className="bg-white shadow rounded-lg p-3 space-y-7">
      <h2 className="text-[1.5rem] font-bold mb-4">{t("filters")}</h2>

      {/* City */}
      <div>
        <label className="block text-[1rem] font-bold mb-1">{t("city")}</label>
        <select
          value={filters?.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className="w-full bg-[#F5F5F5] h-[48px] rounded-lg px-3 py-2 text-sm select-filter"
        >
          <option value="Damascus">Damascus</option>
          <option value="Aleppo">Aleppo</option>
          <option value="Homs">Homs</option>
        </select>
      </div>

      {/* Location */}
      <div>
        <label className="block text-[1rem] font-bold mb-1">
          {t("nearbyLocation")}
        </label>
        <input
          type="text"
          value={filters?.location}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full h-[48px] bg-[#f5f5f5] rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-[1rem] font-bold mb-1">{t("type")}</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleChange("type", "SALE")}
            className={`flex-1 px-3 py-2 border border-[#DDDDDD] rounded-lg text-sm ${
              filters?.type === "SALE"
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {t("forSale")}
          </button>
          <button
            type="button"
            onClick={() => handleChange("type", "RENT")}
            className={`flex-1 px-3 py-2 border border-[#DDDDDD] rounded-lg text-sm ${
              filters?.type === "RENT"
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {t("forRent")}
          </button>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-[1rem] font-bold mb-1">
          {t("category")}
        </label>
        <select
          value={filters?.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="w-full bg-[#F5F5F5] h-[48px] rounded-lg px-3 py-2 text-sm select-filter"
        >
          <option value="">---</option>
          {allCategory?.map((item) => (
            <option key={item.id} value={item.id}>
              {i18n.language === "ar" ? item.arabic_name : item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="relative">
        <label className="block text-[1rem] font-bold mb-3">
          {t("priceRange")}
        </label>

        <div className="relative h-2">
          {/* Track background */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300 rounded transform -translate-y-1/2"></div>
          {/* Active range fill */}
          <div
            className="absolute h-1 bg-[#00B4D8] top-[4px] rounded transform -translate-y-1/2"
            style={{
              left: `${(filters?.priceRange[0] / 25000) * 100}%`,
              right: `${100 - (filters?.priceRange[1] / 25000) * 100}%`,
            }}
          ></div>

          {/* Min slider */}
          <input
            type="range"
            min="0"
            max="25000"
            value={filters?.priceRange[0]}
            onChange={(e) => {
              const newMin = +e.target.value;
              if (newMin <= filters?.priceRange[1]) {
                handleChange("priceRange", [newMin, filters?.priceRange[1]]);
              }
            }}
            className="absolute top-0 w-full pointer-events-none appearance-none bg-transparent"
            style={{
              zIndex: filters?.priceRange[0] === filters?.priceRange[1] ? 5 : 6, // bring forward if equal
            }}
          />

          {/* Max slider */}
          <input
            type="range"
            min="0"
            max="25000"
            value={filters?.priceRange[1]}
            onChange={(e) => {
              const newMax = +e.target.value;
              if (newMax >= filters?.priceRange[0]) {
                handleChange("priceRange", [filters?.priceRange[0], newMax]);
              }
            }}
            className="absolute top-0 w-full pointer-events-none appearance-none bg-transparent"
            style={{
              zIndex: filters?.priceRange[0] === filters?.priceRange[1] ? 6 : 5, // swap priority
            }}
          />
        </div>

        <div className="flex justify-between text-sm mt-4 gap-5 w-full">
          <div className="flex flex-col w-[50%] text-base font-bold">
            {t('min')}{" "}
            <span className="mt-1 h-[48px] bg-[#F5F5F5] flex items-center px-4 text-base font-normal rounded-md">
              £{filters?.priceRange[0]}
            </span>
          </div>
          <div className="flex flex-col w-[50%] text-base font-bold">
            {t('max')}
            <span className="mt-1 h-[48px] bg-[#F5F5F5] flex items-center px-4 text-base font-normal rounded-md">
              £{filters?.priceRange[1]}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
