import React, { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthModal } from "../../common/modal/AuthModal";
import { OtpVerificationModal } from "./OtpVerificationModal";
import { AuthConfirmationModal } from "../../common/modal/AuthConfirmationModal";
import { AUTH } from "../../config/endPoints";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import useSearchDebounce from "../../utils/searchDebounce";
import LoadingButton from "../../common/loadingButton/LoadingButton";
import { ROUTE } from "../../config/constants";
import { useNavigate } from "react-router-dom";
import verified from "../../assets/icon/verified.svg";

export const RegisterModal = ({ show, hide, showLoginModal }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [countryCode, setCountryCode] = useState(963);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [toggle, setToggle] = useState(true);
  const [toggleConfirm, setToggleConfirm] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();
  const [userNameAvailable, setUserNameAvailable] = useState({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showAvailable, setShowAvailable] = useState(false);

  const tabs = [
    { id: 1, label: t("phone") },
    { id: 2, label: t("userName") },
  ];

  const schema = Yup.object().shape({
    phone: Yup.string().when("$tab", {
      is: 1,
      then: (schema) =>
        schema
          .required(t("userPhoneRequired"))
          .min(10, t("phoneInvalid"))
          .max(12, t("phoneInvalid")),
    }),
    username: Yup.string().when("$tab", {
      is: 2,
      then: (schema) =>
        schema.required(t("usernameRequired")).min(3, t("usernameMin")),
    }),
    email: Yup.string().when("$tab", {
      is: 2,
      then: (schema) =>
        schema
          .required(t("emailRequired"))
          .email(t("validEmail"))
          .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            t("validEmail")
          ),
    }),
    password: Yup.string().when("$tab", {
      is: 2,
      then: (schema) =>
        schema
          .required(t("userPasswordRequired"))
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            t("passwordRegx")
          ),
    }),
    confirmPassword: Yup.string().when("$tab", {
  is: 2,
  then: (schema) =>
    schema
      .required(t("confirmPasswordRequired"))
      .test(
        "passwords-match",
        t("passwordsMustMatch"),
        function (value) {
          if (!value) return true; // required() handles empty
          return value === this.resolve(Yup.ref("password"));
        }
      ),
}),
    terms: Yup.bool()
      .oneOf([true], t("termsRequired"))
      .required(t("termsRequired")),
  });

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    context: { tab: activeTab },
  });

  const handlepass = () => {
    setToggle(!toggle);
  };

  const handlepassConfirm = () => {
    setToggleConfirm(!toggleConfirm);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setShowOtpModal(true);
    hide();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    let payload, apiUrl;
    if (activeTab === 1) {
      payload = {
        country_code: `+${countryCode}`,
        phone: data.phone,
      };
      apiUrl = AUTH.SIGNUP_PHONE;
    } else if (activeTab === 2) {
      setUserEmail(data.email);
      payload = {
        username: data.username,
        email: data.email,
        password: data.password,
      };
      apiUrl = AUTH.SIGNUP_USERNAME;
    }

    try {
      const response = await postRequest(apiUrl, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        if (activeTab === 1) {
          showSuccessToast(response?.data?.message);
          setShowOtpModal(true);
          setLoading(false);
        } else {
          setShowConfirmationModal(true);
          showSuccessToast(response?.data?.message);
          reset();
          setPhoneNumber(null);
          setCountryCode(963);
          setUserNameAvailable({});
          setLoading(false);
        }
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleVerifiyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      let payload, apiUrl;
      if (activeTab === 1) {
        apiUrl = AUTH.SIGNUP_PHONE_VERIFY;
        payload = {
          country_code: `+${countryCode}`,
          phone: phoneNumber,
          otp: fullCode,
        };
      } else {
        apiUrl = AUTH.SIGNUP_USERNAME_VERIFY;
        payload = {
          email: userEmail,
          otp: fullCode,
        };
      }

      try {
        const response = await postRequest(apiUrl, payload);
        if (response?.data?.success && response?.data?.statusCode === 200) {
          showSuccessToast(response?.data?.message);
          showLoginModal();
          hide();
          reset();
          setCode(["", "", "", ""]);
          setShowOtpModal(false);
          setLoading(false);
          setPhoneNumber(null);
          setCountryCode(963);
          setUserNameAvailable({});
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

  console.log("phoneNumber", phoneNumber);
  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    let payload;
    if (activeTab === 1) {
      payload = {
        country_code: `+${countryCode}`,
        phone: phoneNumber,
      };
    } else {
      payload = {
        email: userEmail,
      };
    }
    try {
      const response = await postRequest(AUTH.RESEND_OTP, payload);
      console.log("response", response);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        setLoading(false);
        setCode(["", "", "", ""]);
        setTimer(30);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

  const handleCheckUserName = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setUserNameAvailable(response?.data);
    }
  };

  useEffect(() => {
    if (searchTextDebounce.length >= 3) {
      handleCheckUserName(
        `${AUTH.CHECK_USERNAME}?username=${searchTextDebounce}`
      );
    } else {
      setUserNameAvailable(null);
    }
  }, [searchTextDebounce]);

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

  useEffect(() => {
    if (userNameAvailable?.data?.available) {
      setShowAvailable(true);
      setTimeout(() => {
        setShowAvailable(false);
      }, 2000);
    }
  }, [userNameAvailable]);

  return (
    <>
      <AuthModal
        show={show}
        hide={() => {
          hide();
          reset();
          setActiveTab(1);
          setUserNameAvailable(null);
          setPhoneNumber(null);
          setCountryCode(963);
          setUserNameAvailable({});
        }}
        title={
          activeTab === 1
            ? t("registerTitleByPhone")
            : t("registerTitleByUsername")
        }
        subtitle={
          activeTab === 1
            ? t("registerSubtitleByPhone")
            : t("registerSubtitleByUsername")
        }
      >
        <div className="flex justify-center border-b border-gray-200">
          <div className="flex gap-6 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  reset();
                  setPhoneNumber(null);
                  setCountryCode(963);
                  setUserNameAvailable({});
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

        <div className="flex h-full justify-between flex-col pt-[50px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {activeTab === 1 && (
              <div>
                {/* <label className="block mb-2 text-md font-bold">
                  {t("countryCode")} & {t("phone")}
                </label>
                <PhoneInput
                  country={"sy"}
                  enableSearch={true}
                  inputClass="!w-full !h-[48px] !bg-gray-100 !border-none !rounded-md !pl-12 "
                  buttonClass="!bg-gray-100 !border-none !rounded-l"
                  dropdownClass="custom-dropdown"
                  onChange={(value, country) => {
                    const countryCode = country?.dialCode;
                    const phoneNumber = value.replace(countryCode, "");

                    setCountryCode(countryCode);
                    setPhoneNumber(phoneNumber);
                    setValue("phone", phoneNumber);
                  }}
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
                      value={phoneNumber}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/\D/g, "");
                        setPhoneNumber(onlyNums);
                      }}
                      className="flex-1 w-full rounded h-[48px] px-4 pr-12 py-2 bg-gray-100 focus:outline-none"
                      placeholder={t("enterPhoneNo")}
                    />
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
                  <label className="block mb-2 text-md font-bold">
                    {t("userName")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      {...register("username")}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSearchTextDebounce(value);
                        setValue("username", value, { shouldValidate: true });
                      }}
                      placeholder={t("enterUsername")}
                      className="w-full h-[48px] rounded-md px-3 py-2 pr-11 bg-gray-100 focus:outline-none"
                    />
                    {userNameAvailable?.data ? (
                      userNameAvailable.data.available ? (
                        <div className="absolute right-3 top-3">
                          <img src={verified} alt="icon" />
                        </div>
                      ) : (
                        <div className="absolute right-3 top-3">
                          <i className="fa-solid fa-ban text-red-600" />
                        </div>
                      )
                    ) : null}
                  </div>
                  {showAvailable && (
                    <p className="text-green-500 text-sm mt-1">
                      {userNameAvailable?.message}
                    </p>
                  )}
                  {!userNameAvailable?.data?.available && (
                    <p className="text-red-500 text-sm mt-1">
                      {userNameAvailable?.message}
                    </p>
                  )}
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-md font-bold">
                    {t("emailField")}
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder={t("enterEmailAdd")}
                    className="w-full h-[48px] rounded-md px-3 py-2 bg-gray-100 focus:outline-none"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-md font-bold">
                    {t("password")}
                  </label>
                  <div className="input-icon-grp">
                    <input
                      {...register("password")}
                      type={toggle === true ? "password" : "text"}
                      id="password"
                      placeholder={t("enterPassword")}
                      className="w-full h-[48px] rounded-md px-3 py-2 pr-11 bg-gray-100 focus:outline-none"
                      autoComplete="off"
                    />
                    <i
                      className={
                        toggle === true
                          ? "fa-regular fa-eye-slash show-pass"
                          : "fa-regular fa-eye show-pass"
                      }
                      onClick={handlepass}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-md font-bold">
                    {t("confirmPassword")}
                  </label>
                  <div className="input-icon-grp">
                    <input
                      type={toggleConfirm === true ? "password" : "text"}
                      {...register("confirmPassword")}
                      placeholder={t("enterConfirmPassword")}
                      className="w-full h-[48px] rounded-md px-3 py-2 pr-11 bg-gray-100 focus:outline-none"
                    />
                    <i
                      className={
                        toggleConfirm === true
                          ? "fa-regular fa-eye-slash show-pass"
                          : "fa-regular fa-eye show-pass"
                      }
                      onClick={handlepassConfirm}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </>
            )}
            <div>
              <div className="flex items-center gap-2 m-0">
                <input
                  type="checkbox"
                  {...register("terms")}
                  id="terms"
                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded-sm checked:text-primary"
                />
                <label htmlFor="terms" className="text-sm">
                  {t("iAccept")}{" "}
                  <span
                    onClick={() => {
                      navigate(ROUTE.TERMS_CONDITIONS);
                      hide();
                      reset();
                      setPhoneNumber(null);
                      setCountryCode(963);
                      setUserNameAvailable({});
                    }}
                    className="text-primary cursor-pointer hover:underline"
                  >
                    {t("termsAndConditions")}
                  </span>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.terms.message}
                </p>
              )}
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              disabled={loading}
              className="bg-primary text-white hover:bg-primaryDark h-[56px] rounded-md"
            >
              {t("signUp")}
            </LoadingButton>
          </form>

          <p className="text-center font-bold text-sm text-gray-500 mt-6 mb-[50px]">
            {t("haveAccount")}{" "}
            <button
              onClick={() => {
                hide();
                showLoginModal();
                reset();
                setUserNameAvailable({});
                setActiveTab(1);
                setPhoneNumber(null);
                setCountryCode(963);
              }}
              className="text-primary hover:underline cursor-pointer"
            >
              {t("singIn")}
            </button>
          </p>
        </div>
      </AuthModal>

      <OtpVerificationModal
        show={showOtpModal}
        hide={() => setShowOtpModal(false)}
        activeTab={activeTab}
        text={activeTab === 1 ? phoneNumber : userEmail}
        code={code}
        setCode={setCode}
        handleSubmit={handleVerifiyOtp}
        handleResend={handleResendOtp}
        loading={loading}
        timer={timer}
      />

      {showConfirmationModal && (
        <AuthConfirmationModal
          onClose={handleCloseConfirmationModal}
          title={t("otpSent")}
          subtitle={t("otpVerificationMsg")}
          buttonName={t("otpVerificationClose")}
        />
      )}
    </>
  );
};
