import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import Autocomplete from "react-google-autocomplete";

export const EditCityLocation = ({
  register,
  errors,
  onSubmit,
  handleSubmit,
  showLocationValidation,
  setUserLocation,
  setShowLocationValidation,
  setCoords,
  control,
  countries,
  states,
  cities,
  selectedCountry,
  selectedState,
  setValue,
  trigger,
  userCountry,
  setUserCountry,
}) => {
  const { t } = useTranslation();
  const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;

  const locationRef = useRef(null);

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

  console.log("userCountry-->", userCountry);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-7 pt-4 flex-wrap md:flex-nowrap">
        <div className="w-full p-5 shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold">{t("chooseLocation")}</h3>
          <p className="text-gray-600">{t("placeYourAd")}</p>

          <div className="py-3">
            {/* Country */}
            <div className="py-3">
              <label className="block mb-2 text-md font-bold">
                {t("country")} <span className="text-red-600">*</span>
              </label>
              <select
                {...register("country")}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  const selectedCountry = countries.find(
                    (c) => c.name === selectedName
                  );

                  setValue("country", selectedName);
                  trigger("country");

                  if (selectedCountry) {
                    setUserCountry(selectedCountry.isoCode);

                    setUserCountry(selectedCountry.isoCode);
                    setStateBounds(null);
                    setCityBounds(null);
                  }

                  setValue("location", "", {
                    shouldDirty: true,
                  });
                  setUserLocation("");
                  setCoords({ lat: null, lng: null, country: null });
                  setShowLocationValidation(false);
                  if (locationRef.current) locationRef.current.value = "";
                }}
                className="w-full rounded p-3 bg-gray-100 focus:outline-none select-filter"
              >
                <option value="">{t("selectCountry")}</option>
                {countries.map((c) => (
                  <option key={c.isoCode} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* State */}
            <div className="py-3">
              <label className="block mb-2 text-md font-bold">
                {t("state")}
              </label>
              {states?.length ? (
                <select
                  {...register("state")}
                  onChange={async (e) => {
                    const stateName = e.target.value;
                    setValue("state", stateName);
                    trigger("state");

                    if (stateName && selectedCountry) {
                      const bounds = await fetchBounds(
                        stateName,
                        selectedCountry
                      );
                      setStateBounds(bounds);
                    }

                    setValue("location", "", {
                      shouldDirty: true,
                    });
                    setUserLocation("");
                    setCoords({ lat: null, lng: null, country: null });
                    setShowLocationValidation(false);
                    if (locationRef.current) locationRef.current.value = "";
                  }}
                  className="w-full rounded p-3 bg-gray-100 focus:outline-none select-filter"
                  disabled={!selectedCountry}
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
                  {...register("state")}
                  placeholder={t("enterStateField")}
                  className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                />
              )}
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            {/* City */}
            <div className="py-3">
              <label className="block mb-2 text-md font-bold">
                {t("city")}
              </label>
              {cities?.length ? (
                <select
                  {...register("city")}
                  onChange={async (e) => {
                    const cityName = e.target.value;
                    setValue("city", cityName);
                    trigger("city");

                    if (cityName && selectedCountry) {
                      const bounds = await fetchBounds(
                        cityName,
                        selectedCountry
                      );
                      setCityBounds(bounds);
                    }

                    setValue("location", "", {
                      shouldDirty: true,
                    });
                    setUserLocation("");
                    setCoords({ lat: null, lng: null, country: null });
                    setShowLocationValidation(false);
                    if (locationRef.current) locationRef.current.value = "";
                  }}
                  className="w-full rounded p-3 bg-gray-100 focus:outline-none select-filter"
                  disabled={!selectedState}
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
                  {...register("city")}
                  placeholder={t("enterCityField")}
                  className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                />
              )}
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full p-5 shadow-lg rounded-lg">
          <h3 className="text-2xl font-bold">{t("nearbyLocation")}</h3>
          <div className="border-b border-gray-200 pt-4"></div>
          <div className="pt-5">
            <div className="py-3">
              <label className="block mb-2 text-md font-bold">
                {t("nearbyLocation")} <span className="text-red-600">*</span>
              </label>
              <div className="input-icon-grp">
                <Controller
                  name="location"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      apiKey={GOOGLE_API_KEY}
                      placeholder={t("nearbyLocation")}
                      onPlaceSelected={(place) => {
                        if (place?.geometry?.location) {
                          const lat = place.geometry.location.lat();
                          const lng = place.geometry.location.lng();
                          const countryObj = place.address_components?.find(
                            (c) => c.types.includes("country")
                          );
                          const country = countryObj
                            ? countryObj.long_name
                            : "";
                          setCoords({ lat, lng, country });
                          onChange(place.formatted_address);
                          setUserLocation(place.formatted_address);
                          setShowLocationValidation(false);
                          trigger("location");
                        }
                      }}
                      defaultValue={value}
                      ref={locationRef}
                      options={{
                        types: ["geocode"],
                        componentRestrictions: {
                          country: userCountry && userCountry.toLowerCase(),
                        },
                        bounds: cityBounds || stateBounds || null,
                        strictBounds: !!(cityBounds || stateBounds),
                      }}
                      onChange={() => {
                        setUserLocation("");
                        setCoords({ lat: null, lng: null, country: null });
                      }}
                      className="w-full rounded p-3 pr-11 bg-gray-100 focus:outline-none"
                    />
                  )}
                />
                <i className="fa-solid fa-magnifying-glass" />
              </div>
              {showLocationValidation && (
                <p className="text-red-500 text-sm">{t("locationRequired")}</p>
              )}
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location?.message}
                </p>
              )}
            </div>
            <div className="py-3">
              <label className="block mb-2 text-md font-bold">
                {t("buildingStreetName")}{" "}
                <span className="text-sm font-normal text-gray-600">
                  ({t("optional")})
                </span>
              </label>
              <input
                type="text"
                {...register("buildingNumber")}
                className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                placeholder={t("enterbuildingStreetName")}
              />
              {errors.buildingNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.buildingNumber.message}
                </p>
              )}
            </div>
            <div className="py-3">
              <label className="block mb-2 text-md font-bold">
                {t("apartmentVillaNumber")}{" "}
                <span className="text-sm font-normal text-gray-600">
                  ({t("optional")})
                </span>
              </label>
              <input
                type="text"
                {...register("apartmentNumber")}
                placeholder={t("enterapartmentVillaNumber")}
                className="w-full rounded p-3 bg-gray-100 focus:outline-none"
              />
              {errors.apartmentNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apartmentNumber.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
