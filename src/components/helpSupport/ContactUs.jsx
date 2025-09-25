import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import { useTranslation } from "react-i18next";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { CUSTOMER, REPORT_LIST } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import LoadingButton from "../../common/loadingButton/LoadingButton";
import { parsePhoneNumberFromString } from "libphonenumber-js";

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
    phone: yup
      .string()
      .required(t("userPhoneRequired"))
      .test("is-valid", t("phoneInvalid"), function (value) {
        if (!value) return false;

        try {
          const phoneNumber = parsePhoneNumberFromString(
            value,
            countryMeta.code.toUpperCase()
          );
          return phoneNumber?.isValid() || false;
        } catch {
          return false;
        }
      }),
    description: yup.string().required(t("descriptionRequired")),
    platform: yup.string().required(t("platformRequired")),
    help: yup.string().required(t("fieldRequired")),
  });
  const [countryMeta, setCountryMeta] = useState({
    code: "sy",
    min: 9,
    max: 9,
  });
  const [countryCode, setCountryCode] = useState(963);
  const [reportList, setReportList] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
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
        setLoading(false);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
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
            <option value="">--{t("select")}--</option>
            {reportList?.map((item) => (
              <option key={item.id} value={item?.id}>
                {i18n.language === "ar" ? item?.arabic_name : item?.name}
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
            <option value="">--{t("select")}--</option>
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
            placeholder={t("enterDescription")}
            className="w-full rounded-md resize-none h-[100px] p-3 bg-gray-100 focus:outline-none"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-md font-bold">
            {t("fullName")}
          </label>
          <input
            type="text"
            {...register("fullName")}
            placeholder={t("enterFullName")}
            className="w-full rounded-md p-3 bg-gray-100 focus:outline-none"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          {/* <label className="block mb-2 text-md font-bold">
            {t("countryCode")} & {t("phone")}
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                country={"sy"}
                enableSearch={true}
                inputClass="!w-full !h-13 !bg-gray-100 !border-none !rounded !pl-12"
                buttonClass="!bg-gray-100 !border-none !rounded-l"
                dropdownClass="custom-dropdown"
                value={field.value || ""}
                onChange={(value, country) => {
                  setCountryCode(country?.dialCode);
                  field.onChange(value);
                }}
              />
            )}
          /> */}

          <div className="flex gap-3">
            <div>
              <label className="block mb-2 text-base text-black font-bold">
                {t("countryCode")}
              </label>
              <div className="flex items-center w-28 h-[48px] bg-gray-100 rounded px-2">
                <PhoneInput
                  country={"sy"}
                  enableSearch={true}
                  containerClass="!w-full"
                  inputClass="!hidden"
                  buttonClass="!bg-gray-100 !border-none !rounded !p-0"
                  dropdownClass="custom-dropdown"
                  onChange={(value, country) => {
                    setCountryCode(country?.dialCode);
                    setCountryMeta({
                      code: country?.countryCode?.toUpperCase(),
                    });
                  }}
                />
                <span className="ml-1 me-3">+{countryCode}</span>
              </div>
            </div>
            <div className="w-full">
              <label className="block mb-2 text-base text-black font-bold">
                {t("phone")}
              </label>
              <input
                type="tel"
                inputMode="numeric"
                {...register("phone")}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                }}
                className="flex-1 w-full rounded h-[48px] px-4 pr-12 py-2 bg-gray-100 focus:outline-none"
                placeholder={t("enterPhoneNo")}
              />
            </div>
          </div>
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
            placeholder={t("enterEmailAdd")}
            className="w-full rounded-md p-3 bg-gray-100 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <LoadingButton
          type="submit"
          loading={loading}
          disabled={loading}
          className="bg-primary text-white text-base hover:bg-primaryDark h-[56px]"
        >
          {t("submit")}
        </LoadingButton>
      </form>
    </div>
  );
};
