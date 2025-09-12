import React from "react";
import selectedLang from "../../assets/icon/selectedLang.svg";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import Autocomplete from "react-google-autocomplete";

export const SelectCityLocation = ({
  cities,
  handleSelectCity,
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
}) => {
  const { t } = useTranslation();
  const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;

  return (
    <div className="flex gap-7 pt-4">
      <div className="w-full p-5 shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold">{t("selectCity")}</h3>
        <p className="text-gray-600">{t("placeYourAd")}</p>
        <div className="py-3">
          <ul className="space-y-5 p-5 border border-gray-200 rounded-lg">
            {cities.map((city) => (
              <li
                key={city.value}
                onClick={() => handleSelectCity(city)}
                className={`${
                  selectedCity.value === city.value
                    ? "text-black font-medium"
                    : "text-gray-600"
                } flex items-center justify-between cursor-pointer p-2 hover:text-black border-b border-gray-100`}
              >
                <span>{city.label}</span>
                {selectedCity.value === city.value && (
                  <img src={selectedLang} alt="icon" />
                )}
              </li>
            ))}
          </ul>
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
