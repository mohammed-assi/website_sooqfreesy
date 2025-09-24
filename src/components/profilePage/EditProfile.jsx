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
import LoadingButton from "../../common/loadingButton/LoadingButton";

export const EditProfile = ({ userInfo, imagePath, setContentLoading }) => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    fullName: yup.string().when("$action", {
      is: "username",
      then: (schema) =>
        schema.min(3, t("usernameMin")).required(t("usernameRequired")),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
    email: yup
      .string()
      .nullable()
      .test("is-valid-email", t("validEmail"), (value) => {
        if (!value) return true;
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      }),
    phone: yup.string().min(10, t("phoneInvalid")),
    gender: yup.string().when("$action", {
      is: "profile",
      then: (schema) => schema.required(t("genderRequired")),
      otherwise: (schema) => schema.notRequired(),
    }),
    dob: yup.date().when("$action", {
      is: "profile",
      then: (schema) => schema.required(t("dobRequired")),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
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
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [activeTab, setactiveTab] = useState(1);
  const [currentAction, setCurrentAction] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: (data, context, options) =>
      yupResolver(schema)(data, { ...context, action: currentAction }, options),
  });

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
        setContentLoading(true);
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
        setContentLoading(false);
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
        setContentLoading(false);
      }
    } else {
      setPreview(null);
      setContentLoading(false);
    }
    setContentLoading(false);
  };

  const handleVerifiyOtp = async (e) => {
    e.preventDefault();
    setVerifyLoading(true);
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      const payload = {
        otp: fullCode,
      };

      try {
        const response = await postRequest(CUSTOMER.VERIFY_OTP, payload);
        if (response?.data?.success && response?.data?.statusCode === 200) {
          let payLoad;
          if (activeTab === 2) {
            payLoad = {
              newEmail: userMail,
            };
          } else if (activeTab === 1) {
            payLoad = {
              country_code: `+${countryCode}`,
              newPhoneNumber: phoneNumber,
            };
          } else {
            return;
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
              setVerifyLoading(false);
            }
          } catch (error) {
            showErrorToast(error?.response?.data?.message);
            setVerifyLoading(false);
          }
          showSuccessToast(response?.data?.message);
          setCode(["", "", "", ""]);
          setShowOtpModal(false);
          setVerifyLoading(false);
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
        setVerifyLoading(false);
      }
    } else {
      showErrorToast(t("enterOtp"));
      setLoading(false);
      setVerifyLoading(false);
    }
    setVerifyLoading(false);
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
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
        setTimer(30);
        setCode(["", "", "", ""]);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const handleVerifyMailNumber = async (type) => {
    let payload;
    if (type === "phone" && phoneNumber?.length > 0) {
      payload = {
        country_code: `+${countryCode}`,
        phone: phoneNumber,
      };
      setactiveTab(1);
    } else if (type === "email" && userMail?.length > 0) {
      payload = {
        email: userMail,
      };
      setactiveTab(2);
    } else {
      return;
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

  const onSubmit = async (data, e) => {
    const action = e.nativeEvent.submitter.value;
    setLoading(true);
    let payload;
    if (action === "username") {
      payload = {
        newUsername: data.fullName,
      };
    }
    if (action === "profile") {
      payload = {
        dob: data.dob ? moment(data.dob).format("YYYY-MM-DD HH:mm:ss.SSS") : "",
        gender: data.gender,
      };
    }

    try {
      const response = await postRequest(CUSTOMER.UPDATE_PROFILE_INFO, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        const res = await getRequest(AUTH.GET_PROFILE);
        if (res?.data?.statusCode === 200) {
          dispatch(setUser(res?.data?.data));

          if (action === "username") {
            reset(
              { ...data, fullName: res?.data?.data?.fullName }, // updated value
              { keepErrors: true }
            );
          }

          if (action === "profile") {
            reset(
              {
                ...data,
                dob: res?.data?.data?.dob
                  ? new Date(res?.data?.data?.dob)
                  : null,
                gender: res?.data?.data?.gender,
              },
              { keepErrors: true }
            );
          }
          setLoading(false);
          setUserNameAvailable({});
        }
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
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
    if (userInfo?.user_profile_url) {
      setPreview(`${imagePath}/${userInfo?.user_profile_url}`);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo?.email) {
      setValue("email", userInfo?.email);
      setUserMail(userInfo?.email);
    }
    if (userInfo?.username) {
      setValue("fullName", userInfo?.username);
    }
    if (userInfo?.gender) {
      setValue("gender", userInfo?.gender);
    }
    if (userInfo?.dob) {
      setValue("dob", userInfo?.dob);
    }

    if (userInfo?.phone && userInfo?.country_code) {
      const cleanCode = userInfo?.country_code.replace("+", "");
      setValue("phone", userInfo?.phone);
      setCountryCode(cleanCode);
      setPhoneNumber(userInfo?.phone);
    }
  }, [userInfo, setValue]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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
            <div className="w-4/5 relative">
              <input
                type="text"
                {...register("fullName")}
                onChange={(e) => setSearchTextDebounce(e.target.value)}
                placeholder={t("enterUsername")}
                className="w-full rounded px-3 py-3 bg-gray-100 focus:outline-none"
              />
              {userNameAvailable?.data?.available && (
                <div className="absolute right-0 top-0">
                  <button
                    type="submit"
                    name="action"
                    value="username"
                    className="w-full px-3 py-3 bg-primary text-white font-semibold rounded-lg rounded-tl-none rounded-bl-none hover:bg-primaryDark transition"
                    onClick={() => setCurrentAction("username")}
                  >
                    {t("saveChangesButton")}
                  </button>
                </div>
              )}
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
                defaultValue={userInfo?.email}
                onChange={(e) => setUserMail(e.target.value)}
                placeholder={t("enterEmailAdd")}
                className="w-full rounded px-3 py-3 bg-gray-100 focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
              {userInfo?.is_email_verified && userMail === userInfo?.email && (
                <div className="absolute right-3 top-3">
                  <img src={verified} alt="verified icon" />
                </div>
              )}
              {userMail !== userInfo?.email && userMail?.length > 0 && (
                <div className="absolute right-0 top-0">
                  <button
                    onClick={() => handleVerifyMailNumber("email")}
                    type="button"
                    className="w-full px-3 py-3 bg-primary text-white font-semibold rounded-lg rounded-tl-none rounded-bl-none hover:bg-primaryDark transition"
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
              <div className="flex gap-3">
                <div>
                  <div className="flex items-center w-28 h-[48px] bg-gray-100 rounded px-2">
                    <PhoneInput
                      country={"sy"}
                      value={`+${countryCode}${phoneNumber}`}
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
              {userInfo?.is_phone_verified &&
                phoneNumber === userInfo.phone && (
                  <div className="absolute right-3 top-3">
                    <img src={verified} alt="verified icon" />
                  </div>
                )}

              {phoneNumber !== userInfo?.phone && phoneNumber?.length > 0 && (
                <div className="absolute right-0 top-0 h-full">
                  <button
                    onClick={() => handleVerifyMailNumber("phone")}
                    type="button"
                    className="h-full px-4 bg-primary text-white font-semibold rounded-lg rounded-tl-none rounded-bl-none hover:bg-primaryDark transition"
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
                  className="w-full px-3 py-3 bg-primary text-white font-semibold rounded-lg rounded-tl-none rounded-bl-none hover:bg-primaryDark transition"
                >
                  {userInfo?.is_password_set
                    ? t("changePasswordButton")
                    : t("createPassword")}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-10 items-center pb-6">
            <label className="text-gray-700 w-1/5">{t("gender")}</label>
            <div className="w-4/5">
              <select
                {...register("gender")}
                className="w-full rounded px-3 py-3 bg-gray-100 focus:outline-none select-filter"
              >
                <option value="">--{t("select")}--</option>
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
            <div className="w-4/5 relative">
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
                    placeholderText={t("selectDate")}
                  />
                )}
              />
              <div className="absolute right-3 top-3">
                <i className="fa-solid fa-calendar-lines fa-lg text-gray-700"/>
              </div>
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dob.message}
                </p>
              )}
            </div>
          </div>
          {(dirtyFields.gender || dirtyFields.dob) && (
            <div className="">
              {/* <button
                type="submit"
                name="action"
                value="profile"
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
              >
                {t("saveChangesButton")}
              </button> */}
              <LoadingButton
                type="submit"
                name="action"
                value="profile"
                loading={loading}
                disabled={loading}
                className="bg-primary text-white text-base hover:bg-primaryDark h-[56px]"
                onClick={() => setCurrentAction("profile")}
              >
                {t("saveChangesButton")}
              </LoadingButton>
            </div>
          )}
        </form>
      </div>
      <ChangePassModal
        isOpen={showChangePassModal}
        onClose={() => setShowChangePassModal(false)}
        userInfo={userInfo}
      />

      <OtpVerificationModal
        show={showOtpModal}
        hide={() => setShowOtpModal(false)}
        activeTab={activeTab}
        text={activeTab === 1 ? phoneNumber : userMail}
        code={code}
        setCode={setCode}
        handleSubmit={handleVerifiyOtp}
        handleResend={handleResendOtp}
        loading={verifyLoading}
        timer={timer}
      />
    </div>
  );
};
