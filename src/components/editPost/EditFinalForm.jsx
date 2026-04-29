import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import addPicIcon from "../../assets/icon/addPic.svg";
import deleteIcon from "../../assets/icon/deleteIcon.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { Controller } from "react-hook-form";
import Autocomplete from "react-google-autocomplete";

export const EditFinalForm = ({
  formData,
  register,
  errors,
  onSubmit,
  handleSubmit,
  pictures,
  setValue,
  control,
  handleDeleteImg,
  setCoords,
  setUserLocation,
  setShowLocationValidation,
  trigger,
  userCountry,
  setSelectedCity,
  showLocationValidation,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY;
  const locationRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    const newPictures = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updated = [...pictures, ...newPictures].slice(0, 10);

    setValue("pictures", updated, { shouldValidate: true });
    event.target.value = "";
  };

  const handleRemove = (index) => {
    const updated = pictures.filter((_, i) => i !== index);
    setValue("pictures", updated, { shouldValidate: true });
  };

  return (
    <div className="flex gap-7 pt-4 flex-wrap md:flex-nowrap items-start">
      <div className="lg:w-[50%] w-full p-5 shadow-lg rounded-lg lg:sticky lg:top-36">
        <h3 className="text-2xl font-semibold">{t("imagesPost")}</h3>
        <div className="border-b border-gray-200 pt-4"></div>

        {!pictures.length ? (
          <div className="h-80 bg-gray-100 border-2 border-dashed border-gray-300 my-4 rounded-xl"></div>
        ) : (
          <div className="bg-white py-4 overflow-hidden relative">
            <Swiper
              pagination={{ dynamicBullets: true }}
              modules={[Pagination]}
            >
              {pictures.map((item, index) => (
                <SwiperSlide key={index} className="relative">
                  <img
                    src={item.preview}
                    alt="uploaded images"
                    className="w-full h-80 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (item?.id) {
                        handleDeleteImg(item.id);
                      } else {
                        handleRemove(index);
                      }
                    }}
                    className="absolute bottom-4 right-4 p-3 bg-red-500 rounded-full"
                  >
                    <img src={deleteIcon} alt="delete" className="w-5 h-5" />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {errors.pictures && (
          <p className="text-red-500 text-sm mb-1">{errors.pictures.message}</p>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        {pictures.length < 10 && (
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-full flex font-semibold gap-4 items-center justify-center py-3 border-2 border-primary rounded text-primary hover:bg-primary hover:text-white cursor-pointer transition group"
          >
            <img
              src={addPicIcon}
              alt="icon"
              className="transition group-hover:brightness-0 group-hover:invert"
            />
            <p>{t("addPicturesButton")}</p>
          </button>
        )}
      </div>
      <div className="lg:w-[50%] w-full p-5 shadow-lg rounded-lg">
        <h3 className="text-2xl font-semibold">{t("includeInformation")}</h3>
        <div className="border-b border-gray-200 pt-4"></div>

        <form
          id="adForm"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 pt-4"
        >
          {formData?.form_data?.map((field, i) => {
            return (
              <div key={i}>
                <label className="block mb-2 text-md font-semibold">
                  {field.label}{" "}
                  {field.required && <span className="text-red-600">*</span>}
                </label>

                {/* Text */}
                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                  />
                )}

                {/* Textarea */}
                {field.type === "textarea" && (
                  <textarea
                    placeholder={field.placeholder}
                    rows={4}
                    {...register(field.name)}
                    className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                  />
                )}

                {/* Number */}
                {field.type === "number" && (
                  <input
                    type="number"
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                  />
                )}

                {/* Checkbox */}
                {field.type === "checkbox" && (
                  <div className="flex flex-col gap-2">
                    {field?.options?.map((opt, idx) => (
                      <label key={idx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={opt.value}
                          {...register(field.name)}
                          className="w-4 h-4"
                        />
                        {opt.label || opt.value}
                      </label>
                    ))}
                  </div>
                )}

                {/* Radio */}
                {field.type === "radio" && (
                  <div className="flex flex-col gap-2">
                    {field?.options?.map((opt, idx) => (
                      <label key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          value={opt.value}
                          {...register(field.name)}
                          className="w-4 h-4"
                        />
                        {opt.label || opt.value}
                      </label>
                    ))}
                  </div>
                )}

                {/* Dropdown / Select */}
                {field.type === "dropdown" && field.name !== "currency" && (
                  <select
                    {...register(field.name)}
                    className="w-full rounded p-3 bg-gray-100 focus:outline-none select-filter"
                  >
                    <option value="">-- {t("select")} --</option>
                    {field?.options?.map((opt, idx) => (
                      <option key={idx} value={opt.value}>
                        {opt.value}
                      </option>
                    ))}
                  </select>
                )}

                {field.type === "dropdown" && field.name === "currency" && (
                  <select
                    {...register(field.name)}
                    className="w-full rounded p-3 bg-gray-100 focus:outline-none select-filter"
                  >
                    <option value="">-- {t("select")} --</option>
                    {field?.options?.map((opt, idx) => (
                      <option key={idx} value={opt.currencyValue}>
                        {opt.value}
                      </option>
                    ))}
                  </select>
                )}

                {/* Date Picker */}
                {field.type === "date" && (
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        selected={value ? new Date(value) : null}
                        onChange={(date) => onChange(date)}
                        placeholderText={field.placeholder || "Select a date"}
                        dateFormat="dd/MM/yyyy"
                        className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                      />
                    )}
                  />
                )}

                {/* Error Message */}
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name].message}
                  </p>
                )}
              </div>
            );
          })}

          <h3 className="text-xl font-semibold">{t("locationDetails")}</h3>

          <div>
            <label className="block mb-2 text-md font-semibold">
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
                        const countryObj = place.address_components?.find((c) =>
                          c.types.includes("country")
                        );
                        const country = countryObj ? countryObj.long_name : "";
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
                        country: userCountry ? userCountry.toLowerCase() : "sy",
                      },
                    }}
                    onChange={() => {
                      setSelectedCity("");
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
              <p className="text-red-500 text-sm">{errors.location?.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-md font-semibold">
              {t("buildingStreetName")}{" "}
              <span className="text-sm font-normal text-gray-600">
                ({t("optional")})
              </span>
            </label>
            <input
              type="text"
              {...register("buildingNumber")}
              placeholder={t("enterbuildingStreetName")}
              className="w-full rounded p-3 bg-gray-100 focus:outline-none"
            />
            {errors.buildingNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.buildingNumber.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-md font-semibold">
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
        </form>
      </div>
    </div>
  );
};
