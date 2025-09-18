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
          onChange={(e) => handleChange("location", e.target.value)} placeholder="Enter Area"
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
          className="w-full bg-[#F5F5F5] rounded-lg px-3 py-2 text-sm select-filter"
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
      <div>
        <label className="block text-sm font-medium mb-1">
          {t("priceRange")}
        </label>
        <input
          type="range"
          min="0"
          max="25000"
          value={filters?.priceRange[0]}
          onChange={(e) =>
            handleChange("priceRange", [+e.target.value, filters?.priceRange[1]])
          }
          className="w-full"
        />  
        <input
          type="range"
          min="0"
          max="25000"
          value={filters?.priceRange[1]}
          onChange={(e) =>
            handleChange("priceRange", [filters?.priceRange[0], +e.target.value])
          }
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-2">
          <span>£{filters?.priceRange[0]}</span>
          <span>£{filters?.priceRange[1]}</span>
        </div>
      </div>
    </aside>
  );
};
