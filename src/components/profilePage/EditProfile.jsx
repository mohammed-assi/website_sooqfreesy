import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import defaultUser from "../../assets/icon/defaultUser.svg";
import editProfile from "../../assets/icon/editProfile.svg";
import verified from "../../assets/icon/verified.svg";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { ChangePassModal } from "./ChangePassModal";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { AUTH, CUSTOMER } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { setUser } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import useSearchDebounce from "../../utils/searchDebounce";
import { OtpVerificationModal } from "../auth/OtpVerificationModal";
import moment from "moment";

export const EditProfile = ({ userInfo, imagePath }) => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    fullName: yup.string().required(t("usernameRequired")),
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
      .min(10, t("phoneInvalid")),
    gender: yup.string().required(t("genderRequired")),
    dob: yup.date().required(t("dobRequired")),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [countryCode, setCountryCode] = useState(963);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [userMail, setUserMail] = useState("");
  const [showChangePassModal, setShowChangePassModal] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [preview, setPreview] = useState(null);
  const [searchTextDebounce, setSearchTextDebounce] = useSearchDebounce();
  const [userNameAvailable, setUserNameAvailable] = useState({});
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      let formData = new FormData();
      formData.append("user_profile_url", file);
      try {
        const response = await postRequest(
          CUSTOMER.UPDATE_PROFILE_PIC,
          formData
        );
        if (response?.data?.success && response?.data?.statusCode === 200) {
          showSuccessToast(response?.data?.message);
          const res = await getRequest(AUTH.GET_PROFILE);
          if (res?.data?.statusCode === 200) {
            dispatch(setUser(res?.data?.data));
          }
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
      }
    } else {
      setPreview(null);
    }
  };

  const handleVerifiyOtp = async (e) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      const payload = {
        otp: fullCode,
      };

      try {
        const response = await postRequest(CUSTOMER.VERIFY_OTP, payload);
        if (response?.data?.success && response?.data?.statusCode === 200) {
          let payLoad;
          if (userMail) {
            payLoad = {
              newEmail: userMail,
            };
          } else {
            payLoad = {
              country_code: `+${countryCode}`,
              newPhoneNumber: phoneNumber,
            };
          }
          try {
            const response = await postRequest(
              CUSTOMER.UPDATE_PROFILE_INFO,
              payLoad
            );
            if (response?.data?.success && response?.data?.statusCode === 200) {
              showSuccessToast(response?.data?.message);
              const res = await getRequest(AUTH.GET_PROFILE);
              if (res?.data?.statusCode === 200) {
                dispatch(setUser(res?.data?.data));
              }
            }
          } catch (error) {
            showErrorToast(error?.response?.data?.message);
          }
          showSuccessToast(response?.data?.message);
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
    if (phoneNumber) {
      payload = {
        country_code: `+${countryCode}`,
        phone: phoneNumber,
      };
    } else {
      payload = {
        email: userMail,
      };
    }
    try {
      const response = await postRequest(AUTH.RESEND_OTP, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const handleVerifyMailNumber = async () => {
    let payload;
    if (phoneNumber) {
      payload = {
        country_code: `+${countryCode}`,
        phone: phoneNumber,
      };
    } else {
      payload = {
        email: userMail,
      };
    }
    try {
      const response = await postRequest(CUSTOMER.SEND_OTP, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        setShowOtpModal(true);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      // newUsername: data.fullName,
      // newEmail: data.email,
      // country_code: `+${countryCode}`,
      // newPhoneNumber: data.phone,
      dob: moment(data.dob).format("YYYY-MM-DD HH:mm:ss.SSS"),
      gender: data.gender,
    };

    try {
      const response = await postRequest(CUSTOMER.UPDATE_PROFILE_INFO, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        const res = await getRequest(AUTH.GET_PROFILE);
        if (res?.data?.statusCode === 200) {
          dispatch(setUser(res?.data?.data));
        }
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
    if (userInfo?.user_profile_url) {
      setPreview(`${imagePath}/${userInfo?.user_profile_url}`);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      setValue("email", userInfo?.email);
      setValue("fullName", userInfo?.username);
      setValue("gender", userInfo?.gender);
      setValue("dob", userInfo?.dob);

      if (userInfo.phone && userInfo.country_code) {
        const cleanCode = userInfo.country_code.replace("+", "");
        const fullNumber = `${cleanCode}${userInfo.phone}`;
        setValue("phone", fullNumber);
        setCountryCode(cleanCode);
        setPhoneNumber(userInfo.phone);
      }
    }
  }, [userInfo, setValue]);

  return (
    <div className="pt-4">
      <h3 className="font-semibold text-2xl py-6">{t("profileDetails")}</h3>

      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-[60%]">
          <div className="flex gap-15 pb-6">
            <label className="text-gray-700">{t("profliePhoto")}</label>
            <div className="relative">
              <img
                src={preview || defaultUser}
                alt="userImg"
                className="w-50 h-40 rounded-lg object-cover"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={handleButtonClick}
                type="button"
                className="absolute -bottom-2 -right-2 rounded-full bg-white p-2"
              >
                <img src={editProfile} alt="icon" className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t("userName")}</label>
            <div className="w-4/5">
              <input
                type="text"
                {...register("fullName")}
                onChange={(e) => setSearchTextDebounce(e.target.value)}
                className="w-full rounded px-3 py-3 bg-gray-100 focus:outline-none"
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
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t("emailField")}</label>
            <div className="w-4/5 relative">
              <input
                type="email"
                {...register("email")}
                onChange={(e) => setUserMail(e.target.value)}
                disabled={userInfo?.is_email_verified}
                className="w-full rounded px-3 py-3 bg-gray-100 focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
              {userInfo?.is_email_verified ? (
                <div className="absolute right-3 top-3">
                  <img src={verified} alt="icon" />
                </div>
              ) : (
                <div className="absolute right-0 top-0">
                  <button
                    onClick={handleVerifyMailNumber}
                    type="button"
                    className="w-full px-3 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
                  >
                    {t("verifyEmailButton")}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t("phoneNofield")}</label>
            <div className="w-4/5 relative">
              <PhoneInput
                country={"sy"}
                enableSearch={true}
                disabled={userInfo?.is_phone_verified}
                inputClass="!w-full !h-12 !bg-gray-100 !border-none !rounded !pl-12"
                buttonClass="!bg-gray-100 !border-none !rounded-l"
                dropdownClass="custom-dropdown"
                value={watch("phone")}
                onChange={(value, country) => {
                  const countryCode = country?.dialCode;
                  const phoneNumber = value.replace(countryCode, "");

                  setCountryCode(countryCode);
                  setPhoneNumber(phoneNumber);
                  setValue("phone", value);
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
              {userInfo?.is_phone_verified ? (
                <div className="absolute right-3 top-3">
                  <img src={verified} alt="icon" />
                </div>
              ) : (
                <div className="absolute right-0 top-0">
                  <button
                    onClick={handleVerifyMailNumber}
                    type="button"
                    className="w-full px-3 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
                  >
                    {t("verifyPhoneButton")}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t("password")}</label>
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
                  {t("changePasswordButton")}
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
                <option value={t("MALE")}>{t("male")}</option>
                <option value={t("FEMALE")}>{t("female")}</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t("dateBirth")}</label>
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
                    yearDropdownItemNumber={70}
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

      <OtpVerificationModal
        show={showOtpModal}
        hide={() => setShowOtpModal(false)}
        activeTab={phoneNumber ? 1 : 2}
        text={phoneNumber ? phoneNumber : userMail}
        code={code}
        setCode={setCode}
        handleSubmit={handleVerifiyOtp}
        handleResend={handleResendOtp}
      />
    </div>
  );
};
