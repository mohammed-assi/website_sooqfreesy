import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import { useTranslation } from "react-i18next";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { CUSTOMER, REPORT_LIST } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";

export const ContactUs = () => {
  const { i18n, t } = useTranslation();
  const schema = yup.object().shape({
    fullName: yup.string().required(t("fullNameRequired")),
    email: yup
      .string()
      .required(t("emailRequired"))
      .email(t("validEmail"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("validEmail")
      ),
    phone: yup.string().required(t("userPhoneRequired")),
    description: yup.string().required(t("descriptionRequired")),
    platform: yup.string().required(t("platformRequired")),
    help: yup.string().required(t("fieldRequired")),
  });

  const [countryCode, setCountryCode] = useState(963);
  const [reportList, setReportList] = useState([]);

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const payload = {
      reportList_id: Number(data.help),
      os_platform: data.platform,
      description: data.description,
      username: data.fullName,
      email: data.email,
      country_code: `+${countryCode}`,
      phone: data.phone,
    };

    try {
      const response = await postRequest(CUSTOMER.CONTACT_US, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        setCountryCode(963);
        setValue("phone", "");
        reset();
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const getContactReportList = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setReportList(response?.data?.data);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getContactReportList(`${REPORT_LIST.CONTACT_US}?reportType=CONTACT_ISSUE`);
  }, []);

  useEffect(() => {
    reset();
  }, [t]);

  return (
    <div className="pb-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-[60%]">
        <div className="">
          <label className="block mb-2 text-md font-bold">
            {t("needHelpWith")}
          </label>
          <select
            {...register("help")}
            className="w-full rounded-md p-3 bg-gray-100 focus:outline-none select-filter"
          >
            {reportList?.map((item) => (
              <option key={item.id} value={item.id}>
                {i18n.language === "ar" ? item.arabic_name : item.name}
              </option>
            ))}
          </select>
          {errors.help && (
            <p className="text-red-500 text-sm mt-1">{errors.help.message}</p>
          )}
        </div>

        <div className="">
          <label className="block mb-2 text-md font-bold">
            {t("OSPlatform")}
          </label>
          <select
            {...register("platform")}
            className="w-full rounded-md p-3 bg-gray-100 focus:outline-none select-filter"
          >
            <option value={t("iOS")}>{t("iOS")}</option>
            <option value={t("android")}>{t("android")}</option>
            <option value={t("desktopPC")}>{t("desktopPC")}</option>
            <option value={t("mobileWeb")}>{t("mobileWeb")}</option>
          </select>
          {errors.platform && (
            <p className="text-red-500 text-sm mt-1">
              {errors.platform.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-md font-bold">
            {t("description")}
          </label>
          <textarea
            type="text"
            {...register("description")}
            rows={4}
            className="w-full rounded-md resize-none h-[100px] p-3 bg-gray-100 focus:outline-none"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-md font-bold">{t("name")}</label>
          <input
            type="text"
            {...register("fullName")}
            className="w-full rounded-md p-3 bg-gray-100 focus:outline-none"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-md font-bold">
            {t("countryCode")} & {t("phone")}
          </label>
          <PhoneInput
            country={"sy"}
            enableSearch={true}
            inputClass="!w-full !h-13 !bg-gray-100 !border-none !rounded !pl-12"
            buttonClass="!bg-gray-100 !border-none !rounded-l"
            dropdownClass="custom-dropdown"
            onChange={(value, country) => {
              const countryCode = country?.dialCode;
              const phoneNumber = value.replace(countryCode, "");

              setCountryCode(countryCode);
              setValue("phone", phoneNumber);
            }}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-md font-bold">
            {t("emailField")}
          </label>
          <input
            type="text"
            {...register("email")}
            className="w-full rounded-md p-3 bg-gray-100 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-primary text-white font-semibold rounded-md hover:bg-primaryDark transition"
        >
          {t("Submit")}
        </button>
      </form>
    </div>
  );
};
