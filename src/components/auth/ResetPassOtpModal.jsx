import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthModal } from "../../common/modal/AuthModal";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthConfirmationModal } from "../../common/modal/AuthConfirmationModal";
import { postRequest } from "../../config/apiFunctions";
import { AUTH } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import LoadingButton from "../../common/loadingButton/LoadingButton";

export const ResetPassOtpModal = ({
  show,
  hide,
  setShowLoginModal,
  userEmail,
  handleResend,
  timer,
}) => {
  const { i18n, t } = useTranslation();
  const inputsRef = useRef([]);
  const [code, setCode] = useState(["", "", "", ""]);
  const [toggle, setToggle] = useState(true);
  const [toggleConfirm, setToggleConfirm] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    password: Yup.string().required(t("userPasswordRequired")),
    // .matches(
    //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*_|:;"'<>,./])[A-Za-z\d~`!@#$%^&*_|:;"'<>,./]{8,}$/,
    //   t("passwordRegx")
    // ),
    confirmPassword: Yup.string()
      .required(t("confirmPasswordRequired"))
      .when("newPassword", {
        is: (val) => val && val.length > 0,
        then: (schema) =>
          schema.test(
            "passwords-match",
            t("passwordsMustMatch"),
            function (value) {
              return !value || value === this.resolve(Yup.ref("newPassword"));
            }
          ),
      }),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handlepass = () => {
    setToggle(!toggle);
  };

  const handlepassConfirm = () => {
    setToggleConfirm(!toggleConfirm);
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleCloseConfirmationModal = () => {
    hide();
    setShowConfirmationModal(false);
    setShowLoginModal(true);
  };

  const onSubmit = async (data) => {
    const fullCode = code.join("");
    if (fullCode.length === 4) {
      setLoading(true);
      const payload = {
        email: userEmail,
        otp: fullCode,
        password: data.password,
      };
      try {
        const response = await postRequest(AUTH.RESET_PASSWORD, payload);
        if (response?.data?.success && response?.data?.statusCode === 200) {
          showSuccessToast(response?.data?.message);
          reset();
          setShowConfirmationModal(true);
          setLoading(false);
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

  useEffect(() => {
    reset();
  }, [t]);

  useEffect(() => {
    if (show && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [show]);

  return (
    <>
      <AuthModal
        show={show}
        hide={() => {
          hide();
          reset();
          setCode(["", "", "", ""]);
        }}
        title={t("createPassTitle")}
        subtitle={`${t("emailVerificationSubtitle")} ${userEmail}`}
      >
        <div className="">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex justify-center gap-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputsRef.current[index] = el)}
                  className={`w-13 h-13 font-semibold text-center text-[22px] border-2 rounded-lg focus:outline-none ${
                    digit ? "border-primary text-primary" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-center font-bold text-sm text-gray-500 mt-3">
              {t("didntReceive")}{" "}
              {timer > 0 ? (
                <span className="text-gray-400">
                  {t("resendIn")} 00:{timer < 10 ? `0${timer}` : timer}
                </span>
              ) : (
                <button
                  onClick={() => {
                    handleResend();
                    setCode(["", "", "", ""]);
                  }}
                  type="button"
                  disabled={loading}
                  className="text-primary hover:underline cursor-pointer disabled:opacity-50"
                >
                  {t("resendIt")}
                </button>
              )}
            </p>

            <div className="pt-3">
              <label className="block mb-2 text-md font-bold">
                {t("createNewPassword")}
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={toggle === true ? "password" : "text"}
                  id="password"
                  placeholder={t("enterNewPass")}
                  className={`${
                    i18n.language === "ar" ? "pl-12" : "pr-12"
                  } w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
                  autoComplete="off"
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

            <div>
              <label className="block mb-2 text-md font-bold">
                {t("reEnterNewPass")}
              </label>
              <div className="relative">
                <input
                  type={toggleConfirm === true ? "password" : "text"}
                  {...register("confirmPassword")}
                  placeholder={t("reenterNewPass")}
                  className={`${
                    i18n.language === "ar" ? "pl-12" : "pr-12"
                  } w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
                />
                <i
                  className={`${
                    toggleConfirm === true
                      ? "fa-regular fa-eye-slash show-pass"
                      : "fa-regular fa-eye show-pass"
                  } ${
                    i18n?.language === "ar" ? "left-3" : "right-3"
                  } absolute top-4  cursor-pointer text-center`}
                  onClick={handlepassConfirm}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              disabled={loading}
              className="bg-primary h-[56px] text-white hover:bg-primaryDark"
            >
              {t("submit")}
            </LoadingButton>
          </form>
        </div>
      </AuthModal>
      {showConfirmationModal && (
        <AuthConfirmationModal
          onClose={handleCloseConfirmationModal}
          title={t("resetModalTilte")}
          subtitle={t("resetModalSubtitle")}
          buttonName={t("resetModalButtonName")}
        />
      )}
    </>
  );
};
