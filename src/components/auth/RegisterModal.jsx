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

export const RegisterModal = ({ show, hide, showLoginModal }) => {
  const { t } = useTranslation();
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

  const tabs = [
    { id: 1, label: t("phone") },
    { id: 2, label: t("userName") },
  ];

  const schema = Yup.object().shape({
    phone: Yup.string().when("$tab", {
      is: 1,
      then: (schema) =>
        schema.required(t("userPhoneRequired")).min(10, t("phoneInvalid")),
    }),
    username: Yup.string().when("$tab", {
      is: 2,
      then: (schema) => schema.required(t("usernameRequired")),
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
          .oneOf([Yup.ref("password")], t("passwordsMustMatch")),
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
          reset();
        } else {
          setShowConfirmationModal(true);
          showSuccessToast(response?.data?.message);
          reset();
        }
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const handleVerifiyOtp = async (e) => {
    e.preventDefault();
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
        console.log("response", response);
        if (response?.data?.success && response?.data?.statusCode === 200) {
          showSuccessToast(response?.data?.message);
          showLoginModal();
          hide();
          reset();
          setCode(["", "", "", ""]);
          setShowOtpModal(false);
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
      }
    }
  };

  const handleResendOtp = async () => {
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
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const handleCheckUserName = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setUserNameAvailable(response?.data);
    }
  };

  useEffect(() => {
    if (searchTextDebounce !== "") {
      handleCheckUserName(
        `${AUTH.CHECK_USERNAME}?username=${searchTextDebounce}`
      );
    }
  }, [searchTextDebounce]);

  useEffect(() => {
    reset();
  }, [t]);

  return (
    <>
      <AuthModal
        show={show}
        hide={() => {
          hide();
          reset();
          setActiveTab(1);
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
        <div className="flex justify-center pt-6 px-8 border-b border-gray-200">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-2 px-6 text-lg font-semibold transition-colors ${
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

        <div className="px-10 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {activeTab === 1 && (
              <div>
                <label className="block mb-2 text-md font-bold">
                  {t("countryCode")} & {t("phone")}
                </label>
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
              </div>
            )}

            {activeTab === 2 && (
              <>
                <div>
                  <label className="block mb-2 text-md font-bold">
                    {t("userName")}
                  </label>
                  <input
                    type="text"
                    {...register("username")}
                    onChange={(e) => setSearchTextDebounce(e.target.value)}
                    className="w-full rounded px-3 py-2 bg-gray-100 focus:outline-none"
                  />
                  {userNameAvailable?.data?.available ? (
                    <p className="text-green-500 text-sm mt-1">
                      {userNameAvailable?.message}
                    </p>
                  ) : (
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
                    className="w-full rounded px-3 py-2 bg-gray-100 focus:outline-none"
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
                      className="w-full rounded px-3 py-2 bg-gray-100 focus:outline-none"
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
                      className="w-full rounded px-3 py-2 bg-gray-100 focus:outline-none"
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

            <div className="flex items-center gap-2 m-0">
              <input
                type="checkbox"
                {...register("terms")}
                id="terms"
                className="accent-primary"
              />
              <label htmlFor="terms" className="text-sm">
                {t("iAccept")}{" "}
                <span className="text-primary cursor-pointer hover:underline">
                  {t("termsAndConditions")}
                </span>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">
                {errors.terms.message}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-3 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
            >
              {t("signUp")}
            </button>
          </form>

          <p className="text-center font-bold text-sm text-gray-500 mt-6">
            {t("haveAccount")}{" "}
            <button
              onClick={() => {
                hide();
                showLoginModal();
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
