import { useTranslation } from "react-i18next";
import Autocomplete from "react-google-autocomplete";
import { useSelector } from "react-redux";
import { Country } from "country-state-city";

export const SideFilter = ({
  allCategory,
  filters,
  handleChange,
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
}) => {
  const { t } = useTranslation();

  const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  const reduxCoords = useSelector((state) => state.location.coords);

  console.log("filters", filters);

  return (
    <aside className="bg-white shadow rounded-lg p-3 space-y-7">
      <h2 className="text-[1.5rem] font-bold mb-4">{t("filters")}</h2>

      <div className="">
        <label className="block mb-2 text-md font-bold">{t("state")}</label>
        {states?.length ? (
          <select
            className="w-full rounded p-3 bg-gray-100 focus:outline-none select-filter"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">{t("selectState")}</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder={t("enterStateField")}
            className="w-full rounded p-3 bg-gray-100 focus:outline-none"
          />
        )}
      </div>

      <div className="">
        <label className="block mb-2 text-md font-bold">{t("city")}</label>
        {cities?.length ? (
          <select
            className="w-full rounded p-3 bg-gray-100 focus:outline-none select-filter"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">{t("selectCityField")}</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder={t("enterCityField")}
            className="w-full rounded p-3 bg-gray-100 focus:outline-none"
          />
        )}
      </div>

      <div>
        <label className="block text-[1rem] font-bold mb-1">
          {t("nearbyLocation")}
        </label>
        {/* <input
          type="text"
          defaultValue={searchTextDebounce}
          onChange={(e) => setSearchTextDebounce(e.target.value)}
          placeholder={t("enterNearbyLocation")}
          className="w-full h-[48px] bg-[#f5f5f5] rounded-lg px-3 py-2 text-sm focus:outline-none"
        /> */}
        <Autocomplete
          apiKey={GOOGLE_API_KEY}
          placeholder={t("nearbyLocation")}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          onPlaceSelected={(place) => {
            if (place?.geometry?.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();

              const countryObj = place.address_components?.find((c) =>
                c.types.includes("country")
              );
              const country = countryObj ? countryObj.long_name : "";
              const newCoords = { lat, lng, country };
              setSelectedLocation(place.formatted_address);

              setCoords(newCoords);
            } else {
              console.warn("No geometry found for selected place:", place);
            }
          }}
          options={{
            types: ["geocode"],
            componentRestrictions: reduxCoords?.country
              ? {
                  country: Country.getAllCountries()
                    .find((c) => c.name === reduxCoords.country)
                    ?.isoCode.toLowerCase(),
                }
              : {},
          }}
          className="w-full text-black rounded p-3 pr-11 bg-gray-100 focus:outline-none"
        />
      </div>

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

      <div>
        <label className="block text-[1rem] font-bold mb-1">
          {t("category")}
        </label>
        <select
          value={filters?.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="w-full bg-[#F5F5F5] h-[48px] rounded-lg px-3 py-2 text-sm select-filter focus:outline-none"
        >
          <option value="">--{t("select")}--</option>
          {allCategory?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[1rem] font-bold mb-1">
          {t("subcategory")}
        </label>
        <select
          value={filters?.subCategory}
          onChange={(e) => handleChange("subCategory", e.target.value)}
          className="w-full bg-[#F5F5F5] h-[48px] rounded-lg px-3 py-2 text-sm select-filter focus:outline-none"
        >
          <option value="">--{t("select")}--</option>
          {subCategoryList?.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* <div className="relative">
        <label className="block text-[1rem] font-bold mb-3">
          {t("priceRange")}
        </label>

        <div className="relative h-2">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300 rounded transform -translate-y-1/2"></div>
          <div
            className="absolute h-1 bg-[#00B4D8] top-[4px] rounded transform -translate-y-1/2"
            style={{
              left: `${(filters?.priceRange[0] / 25000) * 100}%`,
              right: `${100 - (filters?.priceRange[1] / 25000) * 100}%`,
            }}
          ></div>

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
            {t("min")}{" "}
            <span className="mt-1 h-[48px] bg-[#F5F5F5] flex items-center px-4 text-base font-normal rounded-md">
              ${filters?.priceRange[0]}
            </span>
          </div>
          <div className="flex flex-col w-[50%] text-base font-bold">
            {t("max")}
            <span className="mt-1 h-[48px] bg-[#F5F5F5] flex items-center px-4 text-base font-normal rounded-md">
              ${filters?.priceRange[1]}
            </span>
          </div>
        </div>
      </div> */}

      <div className="relative">
        <label className="block text-[1rem] font-bold mb-3">
          {t("priceRange")}
        </label>

        {/* Range Slider */}
        <div className="relative h-2">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300 rounded transform -translate-y-1/2"></div>
          <div
            className="absolute h-1 bg-[#00B4D8] top-[4px] rounded transform -translate-y-1/2"
            style={{
              left: `${(filters.priceRange[0] / 25000) * 100}%`,
              right: `${100 - (filters.priceRange[1] / 25000) * 100}%`,
            }}
          ></div>

          {/* Min Range */}
          <input
            type="range"
            min="0"
            max="25000"
            value={filters.priceRange[0]}
            onChange={(e) => {
              let newMin = Number(e.target.value);
              if (newMin <= filters.priceRange[1]) {
                handleChange("priceRange", [newMin, filters.priceRange[1]]);
              }
            }}
            className="absolute top-0 w-full pointer-events-none appearance-none bg-transparent"
            style={{
              zIndex: filters.priceRange[0] === filters.priceRange[1] ? 5 : 6,
            }}
          />

          {/* Max Range */}
          <input
            type="range"
            min="0"
            max="25000"
            value={filters.priceRange[1]}
            onChange={(e) => {
              let newMax = Number(e.target.value);
              if (newMax >= filters.priceRange[0]) {
                handleChange("priceRange", [filters.priceRange[0], newMax]);
              }
            }}
            className="absolute top-0 w-full pointer-events-none appearance-none bg-transparent"
            style={{
              zIndex: filters.priceRange[0] === filters.priceRange[1] ? 6 : 5,
            }}
          />
        </div>

        {/* Number Inputs */}
        <div className="flex justify-between text-sm mt-4 gap-5 w-full">
          {/* Min Input */}
          <div className="flex flex-col w-[50%] text-base font-bold">
            {t("min")}
            <input
              type="number"
              min="0"
              max="25000"
              value={filters.priceRange[0]}
              onChange={(e) => {
                let newMin = Number(e.target.value);
                if (newMin > filters.priceRange[1])
                  newMin = filters.priceRange[1];
                handleChange("priceRange", [newMin, filters.priceRange[1]]);
              }}
              className="mt-1 h-[48px] bg-[#F5F5F5] px-4 text-base font-normal rounded-md focus:outline-none no-arrow"
            />
          </div>

          {/* Max Input */}
          <div className="flex flex-col w-[50%] text-base font-bold">
            {t("max")}
            <input
              type="number"
              min="0"
              max="25000"
              value={filters.priceRange[1]}
              onChange={(e) => {
                let newMax = Number(e.target.value);
                if (newMax < filters.priceRange[0])
                  newMax = filters.priceRange[0];
                handleChange("priceRange", [filters.priceRange[0], newMax]);
              }}
              className="mt-1 h-[48px] bg-[#F5F5F5] px-4 text-base font-normal rounded-md focus:outline-none no-arrow"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
