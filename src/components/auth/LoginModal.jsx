import { useEffect, useState } from "react";
import { AuthModal } from "../../common/modal/AuthModal";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
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

function LoginModal({ show, hide, setShowLoginModal }) {
  const { t } = useTranslation();
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
    password: Yup.string().when("$tab", {
      is: 2,
      then: (schema) => schema.required(t("userPasswordRequired")),
    }),
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

  const handleOpenRegisterModal = () => {
    hide();
    setShowRegisterModal(true);
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
      };
      apiUrl = AUTH.LOGIN_USERNAME;
    }

    try {
      const response = await postRequest(apiUrl, payload);

      if (response?.data?.success && response?.data?.statusCode === 200) {
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
      const payload = {
        country_code: `+${countryCode}`,
        phone: phoneNumber,
        otp: fullCode,
      };
      try {
        const response = await postRequest(AUTH.LOGIN_PHONE_VERIFY, payload);
        console.log("response", response);
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
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
        setLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const payload = {
      country_code: `+${countryCode}`,
      phone: phoneNumber,
    };
    try {
      const response = await postRequest(AUTH.RESEND_OTP, payload);
      console.log("response", response);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        setLoading(false);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
  };

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
                <label className="block mb-2 text-base text-black font-bold">
                  {t("countryCode")} & {t("phone")}
                </label>
                <PhoneInput
                  country={"sy"}
                  enableSearch={true}
                  inputClass="!w-full !h-[48px] !bg-gray-100 !border-none !rounded !pl-12"
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
                  <label className="block mb-2 text-base text-black font-bold">
                    {t("userName")}
                  </label>
                  <input
                    type="text"
                    {...register("username")}
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
                  <div className="input-icon-grp">
                    <input
                      {...register("password")}
                      type={toggle === true ? "password" : "text"}
                      id="password"
                      className="w-full rounded h-[48px] px-4 pr-12 py-2 bg-gray-100 focus:outline-none"
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
                <p
                  onClick={handleOpenForgotModal}
                  className="text-end text-md font-bold text-primaryDark cursor-pointer"
                >
                  {t("forgotPassword")}
                </p>
              </>
            )}

            {/* <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
            >
              {t("login")}
            </button> */}
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
              onClick={handleOpenRegisterModal}
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
      />
    </>
  );
}

export default LoginModal;
