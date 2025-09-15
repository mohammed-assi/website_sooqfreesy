import React, { useEffect, useState } from "react";
import selectedLang from "../../assets/icon/selectedLang.svg";
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
}) => {
  const { t } = useTranslation();
  const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  const [citiesList, setCitiesList] = useState([]);

  useEffect(() => {
    const country = Country.getAllCountries().find(
      (c) => c.name === coords.country
    );

    if (country) {
      const cities = City.getCitiesOfCountry(country.isoCode);
      setCitiesList(cities.map((c) => c.name));
    }
  }, [coords.country]);

  return (
    <div className="flex gap-7 pt-4">
      <div className="w-full p-5 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold">{t("selectCity")}</h3>
        <p className="text-gray-600">{t("placeYourAd")}</p>
        <div className="py-3">
          {citiesList.length > 0 ? (
            <ul className="space-y-5 p-5 border border-gray-200 rounded-lg">
              {citiesList.map((city) => (
                <li
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`${
                    selectedCity === city
                      ? "text-black font-medium"
                      : "text-gray-600"
                  } flex items-center justify-between cursor-pointer p-2 hover:text-black border-b border-gray-100`}
                >
                  <span>{city}</span>
                  {selectedCity === city && (
                    <img src={selectedLang} alt="icon" />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 pt-4">
              {t("selectCities")} <span className="text-red-600">*</span>
            </p>
          )}
        </div>
      </div>
      <div className="w-full p-5 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold">{t("nearbyLocation")}</h3>
        <div className="border-b border-gray-200 pt-4"></div>
        <div className="pt-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-2 text-md font-bold">
                {t("nearbyLocation")}
                <span className="text-red-600">*</span>
              </label>
              <div className="input-icon-grp">
                <Controller
                  name="location"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      apiKey={GOOGLE_API_KEY}
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
                        }
                      }}
                      defaultValue={value}
                      options={{
                        types: ["geocode"],
                      }}
                      onChange={() => {
                        setSelectedCity("");
                        setCitiesList([]);
                        setUserLocation("");
                        setCoords({ lat: null, lng: null, country: null });
                      }}
                      className="w-full rounded p-3 bg-gray-100 focus:outline-none"
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
            <div>
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
              />
              {errors.buildingNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.buildingNumber.message}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-md font-bold">
                {t("apartmentVillaNumber")}{" "}
                <span className="text-sm font-normal text-gray-600">
                  ({t("optional")})
                </span>
              </label>
              <input
                type="text"
                {...register("apartmentNumber")}
                className="w-full rounded p-3 bg-gray-100 focus:outline-none"
              />
              {errors.apartmentNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.apartmentNumber.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
