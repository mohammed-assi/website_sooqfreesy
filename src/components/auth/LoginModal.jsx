// import { useEffect, useRef, useState } from "react";
// import { AuthModal } from "../../common/modal/AuthModal";
// import { useTranslation } from "react-i18next";
// import { useForm } from "react-hook-form";
// import * as Yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { RegisterModal } from "./RegisterModal";
// import ForgotPasswordModal from "./ForgotPasswordModal";
// import { OtpVerificationModal } from "./OtpVerificationModal";
// import { AUTH } from "../../config/endPoints";
// import { postRequest } from "../../config/apiFunctions";
// import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
// import { useDispatch } from "react-redux";
// import { login } from "../../redux/slices/authSlice";
// import axios from "axios";
// import { setUser } from "../../redux/slices/userSlice";
// import LoadingButton from "../../common/loadingButton/LoadingButton";
// import { parsePhoneNumberFromString } from "libphonenumber-js";
// import { LOCAL_STORAGE } from "../../config/constants";
// import ReactCountryFlag from "react-country-flag";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

// function LoginModal({ show, hide, setShowLoginModal }) {
//   const { i18n, t } = useTranslation();
//   const phoneRef = useRef(null);
//   const dispatch = useDispatch();
//   const [activeTab, setActiveTab] = useState(1);
//   const [countryCode, setCountryCode] = useState(963);
//   const [phoneNumber, setPhoneNumber] = useState(null);
//   const [toggle, setToggle] = useState(true);
//   const [showRegisterModal, setShowRegisterModal] = useState(false);
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [code, setCode] = useState(["", "", "", ""]);
//   const [loading, setLoading] = useState(false);
//   const [timer, setTimer] = useState(0);
//   const [selectedCountry, setSelectedCountry] = useState("sy");
//   const [resetKey, setResetKey] = useState(0);
//   const [countryMeta, setCountryMeta] = useState({
//     code: "sy",
//     min: 9,
//     max: 9,
//   });
//   const [otp, setOtp] = useState("");

//   const tabs = [
//     { id: 1, label: t("phone") },
//     { id: 2, label: t("userName") },
//   ];

//   const schema = Yup.object().shape({
//     phone: Yup.string().when("$tab", {
//       is: 1,
//       then: (schema) =>
//         schema
//           .required(t("userPhoneRequired"))
//           .matches(/^\d+$/, t("phoneInvalid"))
//           .min(8, t("phoneInvalid"))
//           .max(12, t("phoneInvalid")),
//       // .test("is-valid", t("phoneInvalid"), function (value) {
//       //   if (!value) return false;

//       //   try {
//       //     const phoneNumber = parsePhoneNumberFromString(
//       //       value,
//       //       countryMeta.code.toUpperCase()
//       //     );
//       //     return phoneNumber?.isValid() || false;
//       //   } catch {
//       //     return false;
//       //   }
//       // }),
//     }),
//     username: Yup.string().when("$tab", {
//       is: 2,
//       then: (schema) => schema.required(t("usernameRequired")),
//     }),
//     password: Yup.string().when("$tab", {
//       is: 2,
//       then: (schema) => schema.required(t("userPasswordRequired")),
//     }),
//   });

//   const {
//     handleSubmit,
//     register,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//     context: { tab: activeTab },
//     defaultValues: {
//       phone: "",
//     },
//   });

//   const handlepass = () => {
//     setToggle(!toggle);
//   };

//   const handleOpenRegisterModal = () => {
//     hide();
//     setShowRegisterModal(true);

//     setSelectedCountry("sy");
//     setCountryCode(963);
//     setCountryMeta({ code: "SY", min: 9, max: 9 });
//     setPhoneNumber("");
//     setResetKey((k) => k + 1);
//   };

//   const handleOpenForgotModal = () => {
//     hide();
//     setShowForgotModal(true);
//   };

//   const onSubmit = async (data) => {
//     setLoading(true);
//     let payload, apiUrl;
//     if (activeTab === 1) {
//       payload = {
//         country_code: `+${countryCode}`,
//         phone: data.phone,
//       };
//       apiUrl = AUTH.LOGIN_PHONE;
//     } else if (activeTab === 2) {
//       payload = {
//         username: data.username,
//         password: data.password,
//         fcm_token: localStorage.getItem(LOCAL_STORAGE.FCM_TOKEN),
//         device_type: "web-app",
//       };
//       apiUrl = AUTH.LOGIN_USERNAME;
//     }

//     try {
//       const response = await postRequest(apiUrl, payload);

//       if (response?.data?.success && response?.data?.statusCode === 200) {
//         setOtp(response?.data?.data?.otp);
//         if (activeTab === 1) {
//           setShowOtpModal(true);
//         } else {
//           const token = response?.data?.data?.token;

//           dispatch(login(response?.data?.data));

//           const res = await axios.get(AUTH.GET_PROFILE, {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           if (res?.data?.statusCode === 200) {
//             dispatch(setUser(res?.data?.data));
//           }

//           showSuccessToast(response?.data?.message);
//           hide();
//           reset();
//           setLoading(false);
//           setSelectedCountry("sy");
//           setCountryCode(963);
//           setCountryMeta({ code: "SY", min: 9, max: 9 });
//           setPhoneNumber("");
//           setResetKey((k) => k + 1);
//         }
//       }
//     } catch (error) {
//       showErrorToast(error?.response?.data?.message);
//       setLoading(false);
//     }
//     setLoading(false);
//   };

//   const handleVerifiyOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const fullCode = code.join("");
//     if (fullCode.length === 4) {
//       const payload = {
//         country_code: `+${countryCode}`,
//         phone: phoneNumber,
//         otp: fullCode,
//         fcm_token: localStorage.getItem(LOCAL_STORAGE.FCM_TOKEN),
//         device_type: "web-app",
//       };
//       try {
//         const response = await postRequest(AUTH.LOGIN_PHONE_VERIFY, payload);

//         if (response?.data?.success && response?.data?.statusCode === 200) {
//           const res = await axios.get(AUTH.GET_PROFILE, {
//             headers: {
//               Authorization: `Bearer ${response?.data?.data?.token}`,
//             },
//           });
//           if (res?.data?.statusCode === 200) {
//             dispatch(setUser(res?.data?.data));
//           }
//           dispatch(login(response?.data?.data));
//           showSuccessToast(response?.data?.message);
//           hide();
//           reset();
//           setCode(["", "", "", ""]);
//           setShowOtpModal(false);
//           setLoading(false);
//           setPhoneNumber(null);
//         }
//       } catch (error) {
//         showErrorToast(error?.response?.data?.message);
//         setLoading(false);
//       }
//     } else {
//       showErrorToast(t("enterOtp"));
//       setLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     if (timer > 0) return;
//     setLoading(true);

//     const payload = {
//       country_code: `+${countryCode}`,
//       phone: phoneNumber,
//     };

//     try {
//       const response = await postRequest(AUTH.RESEND_OTP, payload);
//       if (response?.data?.success && response?.data?.statusCode === 200) {
//         setOtp(response?.data?.data?.otp);
//         showSuccessToast(response?.data?.message);
//         setCode(["", "", "", ""]);
//         setTimer(30);
//       }
//     } catch (error) {
//       showErrorToast(error?.response?.data?.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     reset();
//   }, [t]);

//   useEffect(() => {
//     let interval;
//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [timer]);

//   return (
//     <>
//       <AuthModal
//         show={show}
//         hide={() => {
//           hide();
//           reset();
//           setActiveTab(1);
//           setPhoneNumber(null);
//           setSelectedCountry("sy");
//           setCountryCode(963);
//           setCountryMeta({ code: "SY", min: 9, max: 9 });
//           setPhoneNumber("");
//           setResetKey((k) => k + 1);
//         }}
//         title={
//           activeTab === 1 ? t("loginTitleByPhone") : t("loginTitleByUsername")
//         }
//         subtitle={
//           activeTab === 1
//             ? t("loginSubtitleByPhone")
//             : t("loginSubtitleByUsername")
//         }
//       >
//         <div className="flex justify-center border-b border-gray-200">
//           <div className="flex w-full">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setActiveTab(tab.id);
//                   reset();
//                   setPhoneNumber(null);
//                   setSelectedCountry("sy");
//                   setCountryCode(963);
//                   setCountryMeta({ code: "SY", min: 9, max: 9 });
//                   setPhoneNumber("");
//                   setResetKey((k) => k + 1);
//                 }}
//                 className={`relative pb-2 px-6 text-base w-[50%] font-bold transition-colors ${
//                   activeTab === tab.id
//                     ? "text-primary"
//                     : "text-gray-600 hover:text-primary"
//                 }`}
//               >
//                 {tab.label}
//                 <span
//                   className={`absolute left-0 -bottom-[1px] h-[2px] w-full rounded-full transition-colors ${
//                     activeTab === tab.id ? "bg-primary" : "bg-transparent"
//                   }`}
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="pt-[50px] flex flex-col justify-between h-full">
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {activeTab === 1 && (
//               <div>
//                 {/* <PhoneInput
//                   country={"sy"}
//                   enableSearch={true}
//                   inputClass="!w-full !h-[48px] !bg-gray-100 !border-none !rounded !pl-12"
//                   buttonClass="!bg-gray-100 !border-none !rounded-l"
//                   dropdownClass="custom-dropdown"
//                   onChange={(value, country) => {
//                     const countryCode = country?.dialCode;
//                     const phoneNumber = value.replace(countryCode, "");

//                     setCountryCode(countryCode);
//                     setPhoneNumber(phoneNumber);
//                     setValue("phone", phoneNumber);
//                   }}
//                 /> */}
//                 {/* <div className="flex gap-3">
//                   <div>
//                     <label className="block mb-2 text-base text-black font-bold">
//                       {t("countryCode")}
//                     </label>
//                     <div className="flex items-center w-28 h-[48px] bg-gray-100 rounded px-2">
//                       <PhoneInput
//                         country={"sy"}
//                         enableSearch={true}
//                         containerClass="!w-full"
//                         inputClass="!hidden"
//                         buttonClass={`${
//                           i18n.language === "ar" ? "right-7" : ""
//                         } !bg-gray-100 !border-none !rounded !p-0`}
//                         dropdownClass="custom-dropdown"
//                         onChange={(value, country) => {
//                           setCountryCode(country?.dialCode);
//                           setCountryMeta({
//                             code: country?.countryCode?.toUpperCase(),
//                           });
//                         }}
//                         inputProps={{
//                           style: {
//                             direction: "ltr",
//                             textAlign:
//                               i18n.language === "ar" ? "right" : "left",
//                           },
//                         }}
//                       />
//                       <span className="ml-1 me-3">+{countryCode}</span>
//                     </div>
//                   </div>
//                   <div className="w-full">
//                     <label className="block mb-2 text-base text-black font-bold">
//                       {t("phone")}
//                     </label>
//                     <input
//                       type="tel"
//                       inputMode="numeric"
//                       {...register("phone")}
//                       value={phoneNumber}
//                       onChange={(e) => {
//                         const onlyNums = e.target.value.replace(/\D/g, "");
//                         setPhoneNumber(onlyNums);
//                         setValue("phone", onlyNums, { shouldValidate: true });
//                       }}
//                       className={`${
//                         i18n.language === "ar"
//                           ? "text-right pl-12"
//                           : "text-left pr-12"
//                       } flex-1 w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
//                       placeholder={t("enterPhoneNo")}
//                     />
//                   </div>
//                 </div> */}
//                 <div className="flex gap-3 relative">
//                   <div>
//                     <label className="block mb-2 text-base text-black font-bold">
//                       {t("countryCode")}
//                     </label>
//                     <div className="flex items-center w-28 h-[48px] bg-gray-100 rounded px-2">
//                       <PhoneInput
//                         key={`${selectedCountry}-${resetKey}`} // force remount when resetKey changes
//                         country={selectedCountry} // controlled selected country (lowercase ISO2)
//                         value={""} // keep it empty so PhoneInput shows selected country correctly
//                         enableSearch={true}
//                         containerClass="!w-full phone-container"
//                         inputClass="!hidden"
//                         buttonClass={`${
//                           i18n.language === "ar" ? "right-7" : ""
//                         } !bg-gray-100 !border-none !rounded !p-0`}
//                         dropdownClass="custom-dropdown"
//                         onChange={(value, country) => {
//                           setCountryCode(country?.dialCode);
//                           setCountryMeta({
//                             code: country?.countryCode?.toUpperCase(),
//                           });
//                           setSelectedCountry(
//                             country?.countryCode?.toLowerCase()
//                           );
//                         }}
//                         ref={phoneRef}
//                       />

//                       <div
//                         className="flex items-center gap-2 cursor-pointer pl-3"
//                         onClick={() => {
//                           const container =
//                             document.querySelector(".phone-container");
//                           if (!container) return;
//                           const btn = container.querySelector(".selected-flag");
//                           if (btn) btn.click();
//                         }}
//                       >
//                         <ReactCountryFlag
//                           countryCode={countryMeta.code || "SY"}
//                           svg
//                           style={{
//                             width: "20px",
//                             height: "14px",
//                             borderRadius: "1px",
//                           }}
//                           title={countryMeta.code || "SY"}
//                         />
//                         <span className="ml-1 me-3">+{countryCode}</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* phone input remains same */}
//                   <div className="w-full">
//                     <label className="block mb-2 text-base text-black font-bold">
//                       {t("phone")}
//                     </label>
//                     <input
//                       type="tel"
//                       inputMode="numeric"
//                       {...register("phone")}
//                       onInput={(e) => {
//                         e.target.value = e.target.value.replace(/\D/g, "");
//                       }}
//                       className={`${
//                         i18n.language === "ar"
//                           ? "text-right pl-12"
//                           : "text-left pr-12"
//                       } flex-1 w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
//                       placeholder={t("enterPhoneNo")}
//                     />
//                   </div>
//                 </div>
//                 {errors.phone && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.phone.message}
//                   </p>
//                 )}
//               </div>
//             )}

//             {activeTab === 2 && (
//               <>
//                 <div>
//                   <label className="block mb-2 text-base text-black font-bold">
//                     {t("userName")}
//                   </label>
//                   <input
//                     type="text"
//                     {...register("username")}
//                     placeholder={t("enterUsername")}
//                     className="w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none"
//                   />
//                   {errors.username && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.username.message}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block mb-2 text-base text-black font-bold">
//                     {t("password")}
//                   </label>
//                   <div className="relative">
//                     <input
//                       {...register("password")}
//                       type={toggle === true ? "password" : "text"}
//                       id="password"
//                       className={`${
//                         i18n.language === "ar" ? "pl-12" : "pr-12"
//                       } w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
//                       autoComplete="off"
//                       placeholder={t("enterPassword")}
//                     />
//                     <i
//                       className={`${
//                         toggle === true
//                           ? "fa-regular fa-eye-slash show-pass"
//                           : "fa-regular fa-eye show-pass"
//                       } ${
//                         i18n?.language === "ar" ? "left-3" : "right-3"
//                       } absolute top-4  cursor-pointer text-center`}
//                       onClick={handlepass}
//                     />
//                   </div>
//                   {errors.password && (
//                     <p className="text-red-500 text-sm">
//                       {errors.password?.message}
//                     </p>
//                   )}
//                 </div>
//                 <p
//                   onClick={handleOpenForgotModal}
//                   className="text-end text-md font-bold text-primaryDark cursor-pointer"
//                 >
//                   {t("forgotPassword")}
//                 </p>
//               </>
//             )}

//             {/* <button
//               type="submit"
//               className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
//             >
//               {t("login")}
//             </button> */}
//             <LoadingButton
//               type="submit"
//               loading={loading}
//               disabled={loading}
//               className="bg-primary text-white text-base hover:bg-primaryDark h-[56px]"
//             >
//               {t("login")}
//             </LoadingButton>
//           </form>

//           <p className="text-center font-bold text-sm text-gray-500 mb-7">
//             {t("newto")}{" "}
//             <button
//               onClick={() => {
//                 handleOpenRegisterModal();
//                 reset();
//                 setActiveTab(1);
//                 setSelectedCountry("sy");
//                 setCountryCode(963);
//                 setCountryMeta({ code: "SY", min: 9, max: 9 });
//                 setPhoneNumber("");
//                 setResetKey((k) => k + 1);
//               }}
//               className="text-primary hover:underline cursor-pointer"
//             >
//               {t("createAcc")}
//             </button>
//           </p>
//         </div>
//       </AuthModal>
//       <RegisterModal
//         show={showRegisterModal}
//         hide={() => {
//           setShowRegisterModal(false);
//           setActiveTab(1);
//         }}
//         showLoginModal={() => setShowLoginModal(true)}
//       />

//       <ForgotPasswordModal
//         show={showForgotModal}
//         hide={() => {
//           setShowForgotModal(false);
//           setActiveTab(1);
//         }}
//         setShowRegisterModal={setShowRegisterModal}
//         setShowLoginModal={setShowLoginModal}
//         setCode={setCode}
//       />

//       <OtpVerificationModal
//         show={showOtpModal}
//         hide={() => setShowOtpModal(false)}
//         activeTab={1}
//         text={phoneNumber}
//         code={code}
//         setCode={setCode}
//         handleSubmit={handleVerifiyOtp}
//         handleResend={handleResendOtp}
//         loading={loading}
//         timer={timer}
//         otp={otp}
//       />
//     </>
//   );
// }

// export default LoginModal;

import { useEffect, useState } from "react";
import { AuthModal } from "../../common/modal/AuthModal";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterModal } from "./RegisterModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { OtpVerificationModal } from "./OtpVerificationModal";
import { AUTH } from "../../config/endPoints";
import { postRequest } from "../../config/apiFunctions";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import axios from "axios";
import { setUser } from "../../redux/slices/userSlice";
import LoadingButton from "../../common/loadingButton/LoadingButton";
import { LOCAL_STORAGE } from "../../config/constants";
import ReactCountryFlag from "react-country-flag";
import Select from "react-select";
import { allCountries } from "country-telephone-data";

function LoginModal({ show, hide, setShowLoginModal }) {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const [countryCode, setCountryCode] = useState(963);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [toggle, setToggle] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("sy");
  const [otp, setOtp] = useState("");

  const tabs = [
    { id: 1, label: t("phone") },
    { id: 2, label: t("userName") },
  ];

  const countryOptions = allCountries.map((c) => ({
    value: c.iso2?.toUpperCase() || c.iso2,
    label: `${c.name} (+${c.dialCode})`,
    dialCode: c.dialCode,
    iso2: c.iso2?.toUpperCase(),
    name: c.name,
  }));

  const defaultCountryOption =
    countryOptions.find((o) => o.iso2 === "SY") || countryOptions[0];

  const schema = Yup.object().shape({
    phone: Yup.string().when("$tab", {
      is: 1,
      then: (schema) =>
        schema
          .required(t("userPhoneRequired"))
          .matches(/^\d+$/, t("phoneInvalid"))
          .min(8, t("phoneInvalid"))
          .max(12, t("phoneInvalid")),
    }),
    username: Yup.string().when("$tab", {
      is: 2,
      then: (schema) => schema.required(t("usernameRequired")),
    }),
    password: Yup.string().when("$tab", {
      is: 2,
      then: (schema) => schema.required(t("userPasswordRequired")),
    }),
  });

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    context: { tab: activeTab },
    defaultValues: {
      phone: "",
    },
  });

  const handlepass = () => {
    setToggle(!toggle);
  };

  const handleOpenRegisterModal = () => {
    hide();
    setShowRegisterModal(true);
    setSelectedCountry("sy");
    setCountryCode(963);
    setPhoneNumber("");
  };

  const handleOpenForgotModal = () => {
    hide();
    setShowForgotModal(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    let payload, apiUrl;
    if (activeTab === 1) {
      payload = {
        country_code: `+${countryCode}`,
        phone: data.phone,
      };
      apiUrl = AUTH.LOGIN_PHONE;
    } else if (activeTab === 2) {
      payload = {
        username: data.username,
        password: data.password,
        fcm_token: localStorage.getItem(LOCAL_STORAGE.FCM_TOKEN),
        device_type: "web-app",
      };
      apiUrl = AUTH.LOGIN_USERNAME;
    }

    try {
      const response = await postRequest(apiUrl, payload);

      if (response?.data?.success && response?.data?.statusCode === 200) {
        setOtp(response?.data?.data?.otp);
        if (activeTab === 1) {
          setShowOtpModal(true);
        } else {
          const token = response?.data?.data?.token;

          dispatch(login(response?.data?.data));

          const res = await axios.get(AUTH.GET_PROFILE, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res?.data?.statusCode === 200) {
            dispatch(setUser(res?.data?.data));
          }

          showSuccessToast(response?.data?.message);
          hide();
          reset();
          setLoading(false);
          setSelectedCountry("sy");
          setCountryCode(963);
          setPhoneNumber("");
        }
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleVerifiyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      const payload = {
        country_code: `+${countryCode}`,
        phone: phoneNumber,
        otp: fullCode,
        fcm_token: localStorage.getItem(LOCAL_STORAGE.FCM_TOKEN),
        device_type: "web-app",
      };
      try {
        const response = await postRequest(AUTH.LOGIN_PHONE_VERIFY, payload);

        if (response?.data?.success && response?.data?.statusCode === 200) {
          const res = await axios.get(AUTH.GET_PROFILE, {
            headers: {
              Authorization: `Bearer ${response?.data?.data?.token}`,
            },
          });
          if (res?.data?.statusCode === 200) {
            dispatch(setUser(res?.data?.data));
          }
          dispatch(login(response?.data?.data));
          showSuccessToast(response?.data?.message);
          hide();
          reset();
          setCode(["", "", "", ""]);
          setShowOtpModal(false);
          setLoading(false);
          setPhoneNumber(null);
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
        setLoading(false);
      }
    } else {
      showErrorToast(t("enterOtp"));
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);

    const payload = {
      country_code: `+${countryCode}`,
      phone: phoneNumber,
    };

    try {
      const response = await postRequest(AUTH.RESEND_OTP, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setOtp(response?.data?.data?.otp);
        showSuccessToast(response?.data?.message);
        setCode(["", "", "", ""]);
        setTimer(30);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reset();
  }, [t]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const findOptionByIso = (isoLower) => {
    if (!isoLower) return defaultCountryOption;
    const isoUpper = isoLower.toUpperCase();
    return (
      countryOptions.find((o) => o.iso2 === isoUpper) || defaultCountryOption
    );
  };

  const formatOptionLabel = ({ name, iso2, dialCode }) => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ReactCountryFlag
          countryCode={iso2 || "SY"}
          svg
          style={{ width: "20px", height: "14px" }}
          title={iso2 || "SY"}
        />
        <div>
          <div style={{ fontSize: 13 }}>{name}</div>
          <div style={{ fontSize: 11, color: "#6B7280" }}>+{dialCode}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <AuthModal
        show={show}
        hide={() => {
          hide();
          reset();
          setActiveTab(1);
          setPhoneNumber(null);
          setSelectedCountry("sy");
          setCountryCode(963);
          setPhoneNumber("");
        }}
        title={
          activeTab === 1 ? t("loginTitleByPhone") : t("loginTitleByUsername")
        }
        subtitle={
          activeTab === 1
            ? t("loginSubtitleByPhone")
            : t("loginSubtitleByUsername")
        }
      >
        <div className="flex justify-center border-b border-gray-200">
          <div className="flex w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  reset();
                  setPhoneNumber(null);
                  setSelectedCountry("sy");
                  setCountryCode(963);
                  setPhoneNumber("");
                }}
                className={`relative pb-2 px-6 text-base w-[50%] font-bold transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute left-0 -bottom-[1px] h-[2px] w-full rounded-full transition-colors ${
                    activeTab === tab.id ? "bg-primary" : "bg-transparent"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-[50px] flex flex-col justify-between h-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {activeTab === 1 && (
              <div>
                <div className="flex gap-3 relative">
                  <div>
                    <label className="block mb-2 text-base text-black font-bold">
                      {t("countryCode")}
                    </label>
                    <div className="flex items-center w-36 h-[48px] bg-gray-100 rounded px-2">
                      <div style={{ width: "100%" }}>
                        <Select
                          value={findOptionByIso(selectedCountry)}
                          onChange={(option) => {
                            setSelectedCountry(option.iso2.toLowerCase());
                            setCountryCode(option.dialCode);
                          }}
                          options={countryOptions}
                          formatOptionLabel={formatOptionLabel}
                          styles={{
                            control: (base) => ({
                              ...base,
                              height: "48px",
                              minHeight: "48px",
                              borderRadius: "6px",
                              backgroundColor: "#f3f4f6",
                              paddingLeft: "8px",
                              paddingRight: "8px",
                              boxShadow: "none",
                              border: "none",
                              outline: "none",
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
                            menu: (base) => ({ ...base, zIndex: 50 }),
                            valueContainer: (base) => ({ ...base, padding: 0 }),
                            indicatorSeparator: () => ({ display: "none" }),
                            dropdownIndicator: (base) => ({
                              ...base,
                              color: "#6B7280",
                              padding: 0,
                            }),
                          }}
                          classNamePrefix="country-select"
                          isSearchable
                          getOptionLabel={(o) => `${o.name} (+${o.dialCode})`}
                          getOptionValue={(o) => o.iso2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block mb-2 text-base text-black font-bold">
                      {t("phone")}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        inputMode="numeric"
                        {...register("phone")}
                        value={phoneNumber || ""}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/\D/g, "");
                          setPhoneNumber(onlyNums);
                          setValue("phone", onlyNums, { shouldValidate: true });
                        }}
                        className={`${
                          i18n.language === "ar" ? "text-right" : "text-left"
                        } flex-1 w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
                        placeholder={t("enterPhoneNo")}
                      />
                    </div>
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            )}

            {activeTab === 2 && (
              <>
                <div>
                  <label className="block mb-2 text-base text-black font-bold">
                    {t("userName")}
                  </label>
                  <input
                    type="text"
                    {...register("username")}
                    placeholder={t("enterUsername")}
                    className="w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-base text-black font-bold">
                    {t("password")}
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={toggle === true ? "password" : "text"}
                      id="password"
                      className={`${
                        i18n.language === "ar" ? "pl-12" : "pr-12"
                      } w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
                      autoComplete="off"
                      placeholder={t("enterPassword")}
                    />
                    <i
                      className={`${
                        toggle === true
                          ? "fa-regular fa-eye-slash show-pass"
                          : "fa-regular fa-eye show-pass"
                      } ${
                        i18n?.language === "ar" ? "left-3" : "right-3"
                      } absolute top-4  cursor-pointer text-center`}
                      onClick={handlepass}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password?.message}
                    </p>
                  )}
                </div>
                <p
                  onClick={handleOpenForgotModal}
                  className="text-end text-md font-bold text-primaryDark cursor-pointer"
                >
                  {t("forgotPassword")}
                </p>
              </>
            )}

            <LoadingButton
              type="submit"
              loading={loading}
              disabled={loading}
              className="bg-primary text-white text-base hover:bg-primaryDark h-[56px]"
            >
              {t("login")}
            </LoadingButton>
          </form>

          <p className="text-center font-bold text-sm text-gray-500 mb-7">
            {t("newto")}{" "}
            <button
              onClick={() => {
                handleOpenRegisterModal();
                reset();
                setActiveTab(1);
                setSelectedCountry("sy");
                setCountryCode(963);
                setPhoneNumber("");
              }}
              className="text-primary hover:underline cursor-pointer"
            >
              {t("createAcc")}
            </button>
          </p>
        </div>
      </AuthModal>
      <RegisterModal
        show={showRegisterModal}
        hide={() => {
          setShowRegisterModal(false);
          setActiveTab(1);
        }}
        showLoginModal={() => setShowLoginModal(true)}
      />

      <ForgotPasswordModal
        show={showForgotModal}
        hide={() => {
          setShowForgotModal(false);
          setActiveTab(1);
        }}
        setShowRegisterModal={setShowRegisterModal}
        setShowLoginModal={setShowLoginModal}
        setCode={setCode}
      />

      <OtpVerificationModal
        show={showOtpModal}
        hide={() => setShowOtpModal(false)}
        activeTab={1}
        text={phoneNumber}
        code={code}
        setCode={setCode}
        handleSubmit={handleVerifiyOtp}
        handleResend={handleResendOtp}
        loading={loading}
        timer={timer}
        otp={otp}
      />
    </>
  );
}

export default LoginModal;
