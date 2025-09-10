import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import addPicIcon from "../../assets/icon/addPic.svg";
import deleteIcon from "../../assets/icon/deleteIcon.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";

export const FinalForm = ({
  formData,
  register,
  errors,
  onSubmit,
  handleSubmit,
  pictures,
  setValue,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    const newPictures = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updated = [...pictures, ...newPictures].slice(0, 5);

    setValue("pictures", updated, { shouldValidate: true });
    event.target.value = "";
  };

  const handleRemove = (index) => {
    const updated = pictures.filter((_, i) => i !== index);
    setValue("pictures", updated, { shouldValidate: true });
  };

  console.log("formData", formData);

  return (
    <div className="flex gap-7 pt-4">
      <div className="w-[50%] p-5 shadow-lg rounded-lg">
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
                    onClick={() => handleRemove(index)}
                    className="absolute bottom-4 right-4 p-3 bg-white/50 rounded-full"
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
          onChange={handleFileChange}
          className="hidden"
        />
        {pictures.length < 5 && (
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
      <div className="w-[50%] p-5 shadow-lg rounded-lg">
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
                  {field.label}
                </label>
                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                  />
                )}

                {field.type === "textarea" && (
                  <textarea
                    placeholder={field.placeholder}
                    rows={4}
                    {...register(field.name)}
                    className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                  />
                )}

                {field.type === "number" && (
                  <input
                    type="number"
                    placeholder={field.placeholder}
                    {...register(field.name)}
                    className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                  />
                )}

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
                        {opt.value}
                      </label>
                    ))}
                  </div>
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
          <h3 className="text-xl font-semibold">Location Details</h3>

          <div>
            <label className="block mb-2 text-md font-semibold">
              {t("nearbyLocation")}*
            </label>
            <div className="input-icon-grp">
              <input
                {...register("location")}
                type="text"
                id="location"
                disabled
                className="w-full rounded p-3 bg-gray-100 focus:outline-none"
                autoComplete="off"
              />
              <i className="fa-solid fa-magnifying-glass" />
            </div>
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
              disabled
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
            <label className="block mb-2 text-md font-semibold">
              {t("apartmentVillaNumber")}{" "}
              <span className="text-sm font-normal text-gray-600">
                ({t("optional")})
              </span>
            </label>
            <input
              type="text"
              disabled
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
  );
};
