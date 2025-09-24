import React, { useEffect, useRef, useState } from "react";
// import selectedLang from "../../assets/icon/selectedLang.svg";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import Autocomplete from "react-google-autocomplete";
import { City, Country } from "country-state-city";

export const SelectCityLocation = ({
  setSelectedCity,
  selectedCity,
  register,
  errors,
  onSubmit,
  handleSubmit,
  showLocationValidation,
  setUserLocation,
  setShowLocationValidation,
  setCoords,
  control,
  coords,
  countries,
  states,
  cities,
  selectedCountry,
  selectedState,
  setValue,
  trigger,
  userCountry, setUserCountry
}) => {
  const { t } = useTranslation();
  const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  const [citiesList, setCitiesList] = useState([]);

  const locationRef = useRef(null);

  useEffect(() => {
    const country = Country.getAllCountries().find(
      (c) => c.name === coords.country
    );

    if (country) {
      const cities = City.getCitiesOfCountry(country.isoCode);
      setCitiesList(cities.map((c) => c.name));
    }
  }, [coords.country]);

  console.log("citiesList", citiesList, selectedCity);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-7 pt-4">
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
                  }

                  setValue("location", "", {
                    shouldDirty: true,
                  });
                  setUserLocation("");
                  setCoords({ lat: null, lng: null, country: null });
                  setSelectedCity("");
                  setCitiesList([]);
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
                {t("state")} <span className="text-red-600">*</span>
              </label>
              <select
                {...register("state")}
                onChange={(e) => {
                  setValue("state", e.target.value);
                  trigger("state");
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
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.state.message}
                </p>
              )}
            </div>

            {/* City */}
            <div className="py-3">
              <label className="block mb-2 text-md font-bold">
                {t("city")} <span className="text-red-600">*</span>
              </label>
              <select
                {...register("city")}
                onChange={(e) => {
                  setValue("city", e.target.value);
                  trigger("city");
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
                          country: userCountry
                            ? userCountry.toLowerCase()
                            : undefined,
                        },
                      }}
                      onChange={() => {
                        setSelectedCity("");
                        setCitiesList([]);
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
