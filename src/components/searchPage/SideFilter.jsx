import { useTranslation } from "react-i18next";
import Autocomplete from "react-google-autocomplete";
import { useSelector } from "react-redux";
import { Country } from "country-state-city";
import { useState } from "react";

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
  handleResetFilters
}) => {
  const { i18n, t } = useTranslation();

  const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  const reduxCoords = useSelector((state) => state.location.coords);
  const currency = useSelector((state) => state.currency.value);

  // const locationRef = useRef(null);
  const [stateBounds, setStateBounds] = useState(null);
  const [cityBounds, setCityBounds] = useState(null);

  const getBoundsFromLatLng = (lat, lng, radiusInKm = 10) => {
    const latChange = radiusInKm / 111;
    const lngChange = radiusInKm / (111 * Math.cos((lat * Math.PI) / 150));

    return {
      north: lat + latChange,
      south: lat - latChange,
      east: lng + lngChange,
      west: lng - lngChange,
    };
  };

  const fetchBounds = async (name, country) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          name + "," + country
        )}&key=${GOOGLE_API_KEY}`
      );
      const data = await res.json();

      if (data.results[0]?.geometry?.bounds) {
        const { northeast, southwest } = data.results[0].geometry.bounds;
        return {
          north: northeast.lat,
          south: southwest.lat,
          east: northeast.lng,
          west: southwest.lng,
        };
      }

      if (data.results[0]?.geometry?.location) {
        const { lat, lng } = data.results[0].geometry.location;
        return getBoundsFromLatLng(lat, lng, 20); // fallback: 20 km box
      }

      return null;
    } catch (err) {
      console.error("Failed to fetch bounds", err);
      return null;
    }
  };

  // compute values (robust and safe)
  const MAX_PRICE = 1000000000;
  const a = Number(filters?.priceRange?.[0] ?? 0);
  const b = Number(filters?.priceRange?.[1] ?? 0);

  // ensure start <= end and both between 0 and MAX_PRICE
  const startVal = Math.max(0, Math.min(a, b));
  const endVal = Math.max(0, Math.min(Math.max(a, b), MAX_PRICE));

  const start = (startVal / MAX_PRICE) * 100;
  const end = (endVal / MAX_PRICE) * 100;

  // robust RTL detection (guard document for SSR)
  const isRtl =
    typeof window !== "undefined" &&
    ((i18n?.dir && i18n.dir() === "rtl") ||
      i18n?.language === "ar" ||
      document?.documentElement?.dir === "rtl");

  // inline style for the filled range: swap left/right on RTL
  const filledStyle = isRtl
    ? {
        right: `${start}%`,
        left: `${100 - end}%`,
        top: "50%",
        transform: "translateY(-50%)",
      }
    : {
        left: `${start}%`,
        right: `${100 - end}%`,
        top: "50%",
        transform: "translateY(-50%)",
      };

  return (
    <aside className="bg-white shadow rounded-lg p-3 space-y-7">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-[1.5rem] font-bold">{t("filters")}</h2>
        <p onClick={handleResetFilters} className="cursor-pointer">{t("reset")}</p>
      </div>

      <div className="">
        <label className="block mb-2 text-md font-bold">{t("state")}</label>
        {states?.length ? (
          <select
            className="w-full rounded p-3 bg-gray-100 focus:outline-none select-filter"
            value={selectedState}
            onChange={async (e) => {
              const stateName = e.target.value;
              setSelectedState(stateName);
              setSelectedCity(""); // reset city when state changes
              setCityBounds(null);

              if (stateName && reduxCoords?.country) {
                const bounds = await fetchBounds(
                  stateName,
                  reduxCoords.country
                );
                setStateBounds(bounds);
              } else {
                setStateBounds(null);
              }
            }}
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
            onChange={async (e) => {
              const cityName = e.target.value;
              setSelectedCity(cityName);

              if (cityName && reduxCoords?.country) {
                const bounds = await fetchBounds(cityName, reduxCoords.country);
                setCityBounds(bounds);
              } else {
                setCityBounds(null);
              }
            }}
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
        <div className="relative">
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
              bounds: cityBounds || stateBounds || null,
              strictBounds: !!(cityBounds || stateBounds),
            }}
            className={`${
              i18n.language === "ar" ? "pl-11" : "pr-10"
            } w-full text-black rounded p-3 bg-gray-100 focus:outline-none`}
          />
          <i
            className={`fa-solid fa-magnifying-glass ${
              i18n.language === "ar" ? "left-2" : "right-2"
            } absolute top-4 text-center`}
          />
        </div>
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
          disabled={filters?.category}
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

      <div className="relative">
        <label className="block text-[1rem] font-bold mb-3">
          {t("priceRange")}
        </label>

        {/* Range Slider */}
        <div className="relative h-2">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300 rounded transform -translate-y-1/2"></div>
          <div
            className="absolute h-1 bg-[#00B4D8] top-[4px] rounded transform -translate-y-1/2"
            style={filledStyle}
          ></div>

          {/* Min Range */}
          <input
            type="range"
            min="0"
            max="1000000000"
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
            max="1000000000"
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
            <div className="relative">
              <p className="absolute top-4 left-0.5 font-normal">
                {currency === "SYP" ? "SYP" : "$"}
              </p>
              <input
                type="number"
                min="0"
                max="1000000000"
                value={filters.priceRange[0] > 0 && filters.priceRange[0]}
                onChange={(e) => {
                  let newMin = Number(e.target.value);
                  if (newMin < 0) newMin = 0;
                  if (newMin > 1000000000) newMin = 1000000000;
                  handleChange("priceRange", [newMin, filters.priceRange[1]]);
                }}
                onBlur={() => {
                  if (filters.priceRange[0] > filters.priceRange[1]) {
                    handleChange("priceRange", [
                      filters.priceRange[1],
                      filters.priceRange[1],
                    ]);
                  }
                }}
                className="mt-1 pl-7 h-[48px] bg-[#F5F5F5] px-4 text-base font-normal rounded-md focus:outline-none no-arrow ml-1 w-full"
              />
            </div>
          </div>

          {/* Max Input */}
          <div className="flex flex-col w-[50%] text-base font-bold">
            {t("max")}
            <div className="relative">
              <p className="absolute top-4 left-0.5 font-normal">
                {currency === "SYP" ? "SYP" : "$"}
              </p>
              <input
                type="number"
                min="0"
                max="1000000000"
                value={filters.priceRange[1] > 0 && filters.priceRange[1]}
                onChange={(e) => {
                  let newMax = Number(e.target.value);
                  if (newMax < 0) newMax = 0;
                  if (newMax > 1000000000) newMax = 1000000000;
                  handleChange("priceRange", [filters.priceRange[0], newMax]);
                }}
                onBlur={() => {
                  // Auto-correct if max < min
                  if (filters.priceRange[1] < filters.priceRange[0]) {
                    handleChange("priceRange", [
                      filters.priceRange[0],
                      filters.priceRange[0],
                    ]);
                  }
                }}
                className="mt-1 ml-1 pl-7 h-[48px] bg-[#F5F5F5] px-4 text-base font-normal rounded-md focus:outline-none no-arrow w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
