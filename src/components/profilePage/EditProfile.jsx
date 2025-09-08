import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import defaultUser from "../../assets/icon/defaultUser.svg";
import editProfile from "../../assets/icon/editProfile.svg";
import verified from "../../assets/icon/verified.svg";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { ChangePassModal } from "./ChangePassModal";

export const EditProfile = () => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    fullName: yup.string().required(t("fullNameRequired")),
    email: yup.string().required(t("emailRequired"))
          .email(t("validEmail"))
          .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            t("validEmail")
          ),
    phone: yup
      .string()
      .required(t("userPhoneRequired")).min(10, t("phoneInvalid")),
    gender: yup.string().required(t("genderRequired")),
    dob: yup.date().required("dobRequired"),
  });

  const [countryCode, setCountryCode] = useState(963);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [showChangePassModal, setShowChangePassModal] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    console.log("phone", phoneNumber);
    console.log("countryCode", countryCode);
  };
  return (
    <div className="pt-4">
      <h3 className="font-semibold text-2xl py-6">{t('profileDetails')}</h3>

      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-[60%]">
          <div className="flex gap-15 pb-6">
            <label className="text-gray-700">{t('profliePhoto')}</label>
            <div className="relative">
              <img
                src={defaultUser}
                alt="userImg"
                className="w-50 h-40 rounded-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 rounded-full bg-white p-2">
                <img src={editProfile} alt="icon" className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t('fullName')}</label>
            <div className="w-4/5">
              <input
                type="text"
                {...register("fullName")}
                className="w-full rounded px-3 py-3 bg-gray-100 focus:outline-none"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t('emailField')}</label>
            <div className="w-4/5 relative">
              <input
                type="email"
                {...register("email")}
                className="w-full rounded px-3 py-3 bg-gray-100 focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
              <div className="absolute right-0 top-0">
                <button
                  type="button"
                  className="w-full px-3 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
                >
                  {t("verifyEmailButton")}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t('phoneNumber')}</label>
            <div className="w-4/5 relative">
              <PhoneInput
                country={"sy"}
                enableSearch={true}
                inputClass="!w-full !h-11 !bg-gray-100 !border-none !rounded !pl-12"
                buttonClass="!bg-gray-100 !border-none !rounded-l"
                dropdownClass="custom-dropdown"
                onChange={(value, country) => {
                  const countryCode = country?.dialCode;
                  const phoneNumber = value.replace(countryCode, "");

                  setCountryCode(countryCode);
                  setPhoneNumber(phoneNumber);
                  setValue("phone", phoneNumber);
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
              <div className="absolute right-3 top-3">
                <img src={verified} alt="icon" />
              </div>
            </div>
          </div>

          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t('password')}</label>
            <div className="w-4/5 relative">
              <input
                type="text"
                disabled
                value="******"
                className="w-full rounded px-3 py-3 bg-gray-100 focus:outline-none"
              />
              <div className="absolute right-0 top-0">
                <button
                  onClick={() => setShowChangePassModal(true)}
                  type="button"
                  className="w-full px-3 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
                >
                  {t('changePasswordButton')}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t("gender")}</label>
            <div className="w-4/5">
              <select
                {...register("gender")}
                className="w-full rounded px-3 py-3 bg-gray-100 focus:outline-none"
              >
                <option value="Male">{t("male")}</option>
                <option value="Female">{t("female")}</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t('dateBirth')}</label>
            <div className="w-4/5">
              <Controller
                control={control}
                name="dob"
                render={({ field }) => (
                  <DatePicker
                    className="w-full rounded px-3 py-3 bg-gray-100 focus:outline-none"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="MM-dd-yyyy"
                    maxDate={new Date()}
                    showYearDropdown
                    scrollableYearDropdown
                  />
                )}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dob.message}
                </p>
              )}
            </div>
          </div>
          <div className="">
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
            >
              {t("saveChangesButton")}
            </button>
          </div>
        </form>
      </div>
      <ChangePassModal
        isOpen={showChangePassModal}
        onClose={() => setShowChangePassModal(false)}
      />
    </div>
  );
};
