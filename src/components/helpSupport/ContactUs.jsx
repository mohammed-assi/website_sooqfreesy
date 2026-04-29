// import React, { useEffect, useRef, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import ReactCountryFlag from "react-country-flag";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { useTranslation } from "react-i18next";
// import { getRequest, postRequest } from "../../config/apiFunctions";
// import { CUSTOMER, REPORT_LIST } from "../../config/endPoints";
// import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
// import LoadingButton from "../../common/loadingButton/LoadingButton";
// import { parsePhoneNumberFromString } from "libphonenumber-js";

// export const ContactUs = () => {
//   const { i18n, t } = useTranslation();

//   const phoneRef = useRef(null);
//   const schema = yup.object().shape({
//     fullName: yup.string().required(t("fullNameRequired")),
//     email: yup
//       .string()
//       .required(t("emailRequired"))
//       .email(t("validEmail"))
//       .matches(
//         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//         t("validEmail")
//       ),
//     phone: yup
//       .string()
//       .required(t("userPhoneRequired"))
//       .test("is-valid", t("phoneInvalid"), function (value) {
//         if (!value) return false;

//         try {
//           const phoneNumber = parsePhoneNumberFromString(
//             value,
//             countryMeta.code.toUpperCase()
//           );
//           return phoneNumber?.isValid() || false;
//         } catch {
//           return false;
//         }
//       }),
//     description: yup.string().required(t("descriptionRequired")),
//     platform: yup.string().required(t("platformRequired")),
//     help: yup.string().required(t("fieldRequired")),
//   });
//   const [countryMeta, setCountryMeta] = useState({
//     code: "sy",
//     min: 9,
//     max: 9,
//   });
//   const [countryCode, setCountryCode] = useState(963);
//   const [reportList, setReportList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const {
//     handleSubmit,
//     register,
//     setValue,
//     reset,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: {
//       phone: "",
//     },
//   });

//   const onSubmit = async (data) => {
//     setLoading(true);
//     const payload = {
//       reportList_id: Number(data.help),
//       os_platform: data.platform,
//       description: data.description,
//       username: data.fullName,
//       email: data.email,
//       country_code: `+${countryCode}`,
//       phone: data.phone,
//     };

//     try {
//       const response = await postRequest(CUSTOMER.CONTACT_US, payload);
//       if (response?.data?.success && response?.data?.statusCode === 200) {
//         showSuccessToast(response?.data?.message);
//         setCountryCode(963);
//         setValue("phone", "");
//         reset();
//         setLoading(false);
//       }
//     } catch (error) {
//       showErrorToast(error?.response?.data?.message);
//       setLoading(false);
//     }
//     setLoading(false);
//   };

//   const getContactReportList = async (url) => {
//     try {
//       const response = await getRequest(url);
//       if (response?.data?.success && response?.data?.statusCode === 200) {
//         setReportList(response?.data?.data);
//       }
//     } catch (error) {
//       showErrorToast(error?.response?.data?.message);
//     }
//   };

//   useEffect(() => {
//     getContactReportList(`${REPORT_LIST.CONTACT_US}?reportType=CONTACT_ISSUE`);
//   }, []);

//   useEffect(() => {
//     reset();
//   }, [t]);

//   return (
//     <div className="pb-8">
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="space-y-5 lg:w-[60%] w-full"
//       >
//         <div className="">
//           <label className="block mb-2 text-md font-bold">
//             {t("needHelpWith")}
//           </label>
//           <select
//             {...register("help")}
//             className="w-full rounded-md p-3 bg-gray-100 focus:outline-none select-filter"
//           >
//             <option value="">--{t("select")}--</option>
//             {reportList?.map((item) => (
//               <option key={item.id} value={item?.id}>
//                 {item?.name}
//               </option>
//             ))}
//           </select>
//           {errors.help && (
//             <p className="text-red-500 text-sm mt-1">{errors.help.message}</p>
//           )}
//         </div>

//         <div className="">
//           <label className="block mb-2 text-md font-bold">
//             {t("OSPlatform")}
//           </label>
//           <select
//             {...register("platform")}
//             className="w-full rounded-md p-3 bg-gray-100 focus:outline-none select-filter"
//           >
//             <option value="">--{t("select")}--</option>
//             <option value={t("iOS")}>{t("iOS")}</option>
//             <option value={t("android")}>{t("android")}</option>
//             <option value={t("desktopPC")}>{t("desktopPC")}</option>
//             <option value={t("mobileWeb")}>{t("mobileWeb")}</option>
//           </select>
//           {errors.platform && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.platform.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="block mb-2 text-md font-bold">
//             {t("description")}
//           </label>
//           <textarea
//             type="text"
//             {...register("description")}
//             rows={4}
//             placeholder={t("enterDescription")}
//             className="w-full rounded-md resize-none h-[100px] p-3 bg-gray-100 focus:outline-none"
//           />
//           {errors.description && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.description.message}
//             </p>
//           )}
//         </div>

//         <div>
//           <label className="block mb-2 text-md font-bold">
//             {t("fullName")}
//           </label>
//           <input
//             type="text"
//             {...register("fullName")}
//             placeholder={t("enterFullName")}
//             className="w-full rounded-md p-3 bg-gray-100 focus:outline-none"
//           />
//           {errors.fullName && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.fullName.message}
//             </p>
//           )}
//         </div>

//         <div>
//           {/* <label className="block mb-2 text-md font-bold">
//             {t("countryCode")} & {t("phone")}
//           </label>
//           <Controller
//             name="phone"
//             control={control}
//             render={({ field }) => (
//               <PhoneInput
//                 country={"sy"}
//                 enableSearch={true}
//                 inputClass="!w-full !h-13 !bg-gray-100 !border-none !rounded !pl-12"
//                 buttonClass="!bg-gray-100 !border-none !rounded-l"
//                 dropdownClass="custom-dropdown"
//                 value={field.value || ""}
//                 onChange={(value, country) => {
//                   setCountryCode(country?.dialCode);
//                   field.onChange(value);
//                 }}
//               />
//             )}
//           /> */}

//           {/* <div className="flex gap-3">
//             <div>
//               <label className="block mb-2 text-base text-black font-bold">
//                 {t("countryCode")}
//               </label>
//               <div className="flex items-center w-28 h-[48px] bg-gray-100 rounded px-2">
//                 <PhoneInput
//                   country={"sy"}
//                   enableSearch={true}
//                   containerClass="!w-full"
//                   inputClass="!hidden"
//                   buttonClass={`${
//                     i18n.language === "ar" ? "right-7" : ""
//                   } !bg-gray-100 !border-none !rounded !p-0`}
//                   dropdownClass="custom-dropdown"
//                   onChange={(value, country) => {
//                     setCountryCode(country?.dialCode);
//                     setCountryMeta({
//                       code: country?.countryCode?.toUpperCase(),
//                     });
//                   }}
//                   inputProps={{
//                     style: {
//                       direction: "ltr",
//                       textAlign: i18n.language === "ar" ? "right" : "left",
//                     },
//                   }}
//                 />
//                 <span className="ml-1 me-3">+{countryCode}</span>
//               </div>
//             </div>
//             <div className="w-full">
//               <label className="block mb-2 text-base text-black font-bold">
//                 {t("phone")}
//               </label>
//               <input
//                 type="tel"
//                 inputMode="numeric"
//                 {...register("phone")}
//                 onInput={(e) => {
//                   e.target.value = e.target.value.replace(/\D/g, "");
//                 }}
//                 className={`${
//                   i18n.language === "ar"
//                     ? "text-right pl-12"
//                     : "text-left pr-12"
//                 } flex-1 w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
//                 placeholder={t("enterPhoneNo")}
//               />
//             </div>
//           </div> */}
//           <div className="flex gap-3 relative">
//             <div>
//               <label className="block mb-2 text-base text-black font-bold">
//                 {t("countryCode")}
//               </label>
//               <div className="flex items-center w-28 h-[48px] bg-gray-100 rounded px-2">
//                 <PhoneInput
//                   country={"sy"}
//                   enableSearch={true}
//                   containerClass="!w-full phone-container"
//                   inputClass="!hidden"
//                   buttonClass={`${
//                     i18n.language === "ar" ? "right-7" : ""
//                   } !bg-gray-100 !border-none !rounded !p-0`}
//                   dropdownClass="custom-dropdown"
//                   onChange={(value, country) => {
//                     setCountryCode(country?.dialCode);
//                     setCountryMeta({
//                       code: country?.countryCode?.toUpperCase(),
//                     });
//                   }}
//                   ref={phoneRef}
//                 />

//                 <div
//                   className="flex items-center gap-2 cursor-pointer pl-3"
//                   onClick={() => {
//                     const container =
//                       document.querySelector(".phone-container");
//                     if (!container) return;
//                     const btn = container.querySelector(".selected-flag");
//                     if (btn) btn.click();
//                   }}
//                 >
//                   <ReactCountryFlag
//                     countryCode={countryMeta.code || "SY"}
//                     svg
//                     style={{
//                       width: "20px",
//                       height: "14px",
//                       borderRadius: "1px",
//                     }}
//                     title={countryMeta.code || "SY"}
//                   />
//                   <span className="ml-1 me-3">+{countryCode}</span>
//                 </div>
//               </div>
//             </div>

//             {/* phone input remains same */}
//             <div className="w-full">
//               <label className="block mb-2 text-base text-black font-bold">
//                 {t("phone")}
//               </label>
//               <input
//                 type="tel"
//                 inputMode="numeric"
//                 {...register("phone")}
//                 onInput={(e) => {
//                   e.target.value = e.target.value.replace(/\D/g, "");
//                 }}
//                 className={`${
//                   i18n.language === "ar"
//                     ? "text-right pl-12"
//                     : "text-left pr-12"
//                 } flex-1 w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
//                 placeholder={t("enterPhoneNo")}
//               />
//             </div>
//           </div>
//           {errors.phone && (
//             <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block mb-2 text-md font-bold">
//             {t("emailField")}
//           </label>
//           <input
//             type="text"
//             {...register("email")}
//             placeholder={t("enterEmailAdd")}
//             className="w-full rounded-md p-3 bg-gray-100 focus:outline-none"
//           />
//           {errors.email && (
//             <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//           )}
//         </div>

//         <LoadingButton
//           type="submit"
//           loading={loading}
//           disabled={loading}
//           className="bg-primary text-white text-base hover:bg-primaryDark h-[56px]"
//         >
//           {t("submit")}
//         </LoadingButton>
//       </form>
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactCountryFlag from "react-country-flag";
import Select from "react-select";
import { allCountries } from "country-telephone-data";
import { useTranslation } from "react-i18next";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { CUSTOMER, REPORT_LIST } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import LoadingButton from "../../common/loadingButton/LoadingButton";
import { parsePhoneNumberFromString } from "libphonenumber-js";
const countryOptions = allCountries.map((c) => {
  return {
    value: c.iso2?.toUpperCase() || c.iso2,
    label: `${c.name} (+${c.dialCode})`,
    dialCode: c.dialCode,
    iso2: c.iso2?.toUpperCase(),
    name: c.name,
  };
});

const defaultCountryOption =
  countryOptions.find((o) => o.iso2 === "SY") || countryOptions[0];

export const ContactUs = () => {
  const { i18n, t } = useTranslation();

  const [countryMeta, setCountryMeta] = useState({
    code: defaultCountryOption.iso2 || "SY",
    min: 1,
    max: 20,
  });
  const [countryCode, setCountryCode] = useState(
    defaultCountryOption.dialCode || 963
  );
  const [selectedCountry, setSelectedCountry] = useState(defaultCountryOption);
  const [reportList, setReportList] = useState([]);
  const [loading, setLoading] = useState(false);

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
            countryMeta.code?.toUpperCase()
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
        setCountryCode(defaultCountryOption.dialCode || 963);
        setSelectedCountry(defaultCountryOption);
        setCountryMeta({
          ...countryMeta,
          code: defaultCountryOption.iso2 || "SY",
        });
        setValue("phone", "");
        reset();
        setLoading(false);
      } else {
        showErrorToast(response?.data?.message || t("somethingWentWrong"));
        setLoading(false);
      }
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error.message ||
          t("somethingWentWrong")
      );
      setLoading(false);
    }
  };

  const getContactReportList = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setReportList(response?.data?.data);
      }
    } catch (error) {
      showErrorToast(
        error?.response?.data?.message ||
          error.message ||
          t("somethingWentWrong")
      );
    }
  };

  useEffect(() => {
    getContactReportList(`${REPORT_LIST.CONTACT_US}?reportType=CONTACT_ISSUE`);
  }, []);

  useEffect(() => {
    reset();
  }, [t]);

  /* Custom renderers for react-select so flag + dial code show in option and value */
  const formatOptionLabel = ({ iso2, dialCode, name }) => {
    return (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode={iso2 || "SY"}
          svg
          style={{
            width: "20px",
            height: "14px",
          }}
          title={iso2 || "SY"}
        />
        <div className="text-sm">
          <div>{name}</div>
          <div className="text-xs text-gray-500">+{dialCode}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 lg:w-[60%] w-full"
      >
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
                {item?.name}
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
          <div className="flex gap-3 relative">
            <div className="w-44">
              <label className="block mb-2 text-base text-black font-bold">
                {t("countryCode")}
              </label>
              <Select
                value={selectedCountry}
                onChange={(option) => {
                  setSelectedCountry(option);
                  setCountryCode(option.dialCode);
                  setCountryMeta((prev) => ({ ...prev, code: option.iso2 }));
                }}
                options={countryOptions.map((o) => ({
                  value: o.value,
                  label: o.label,
                  dialCode: o.dialCode,
                  iso2: o.iso2,
                  name: o.name,
                }))}
                formatOptionLabel={(opt) =>
                  formatOptionLabel({
                    name: opt.name,
                    label: opt.label,
                    iso2: opt.iso2,
                    dialCode: opt.dialCode,
                  })
                }
                className="w-full flex-1"
                classNamePrefix="country-select"
                isSearchable
                defaultValue={selectedCountry}
                getOptionLabel={(o) => `${o.name} (+${o.dialCode})`}
                getOptionValue={(o) => o.iso2}
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "48px",
                    minHeight: "48px",
                    borderRadius: "6px",
                    backgroundColor: "#f3f4f6",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    boxShadow: "none",
                    border: "none",
                    outline: "none",
                    "&:hover": {
                      border: "none",
                    },
                  }),
                  singleValue: (base) => ({
                    ...base,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }),
                  option: (base, state) => ({
                    ...base,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: state.isSelected
                      ? "#e5e7eb"
                      : state.isFocused
                      ? "#f3f4f6"
                      : "white",
                    color: "black",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 50,
                  }),
                }}
              />
            </div>

            <div className="flex-1">
              <label className="block mb-2 text-base text-black font-bold">
                {t("phone")}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  inputMode="numeric"
                  {...register("phone")}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                  className={`${
                    i18n.language === "ar" ? "text-right " : "text-left "
                  } flex-1 w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
                  placeholder={t("enterPhoneNo")}
                />
              </div>
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

export default ContactUs;
