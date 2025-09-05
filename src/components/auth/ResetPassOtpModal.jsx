import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthModal } from "../../common/modal/AuthModal";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthConfirmationModal } from "../../common/modal/AuthConfirmationModal";
import { postRequest } from "../../config/apiFunctions";
import { AUTH } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";

export const ResetPassOtpModal = ({
  show,
  hide,
  setShowLoginModal,
  userEmail,
  handleResend,
}) => {
  const { t } = useTranslation();
  const inputsRef = useRef([]);
  const [code, setCode] = useState(["", "", "", ""]);
  const [toggle, setToggle] = useState(true);
  const [toggleConfirm, setToggleConfirm] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const schema = Yup.object().shape({
    password: Yup.string()
      .required(t("userPasswordRequired"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        t("passwordRegx")
      ),
    confirmPassword: Yup.string()
      .required(t("confirmPasswordRequired"))
      .oneOf([Yup.ref("password")], t("passwordsMustMatch")),
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
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
      }
    }
  };

  return (
    <>
      <AuthModal
        show={show}
        hide={() => {
          hide();
        }}
        title={t("createPassTitle")}
        subtitle={`${t("emailVerificationSubtitle")} ${userEmail}`}
      >
        <div className="px-10 py-8">
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
                  className="w-12 h-12 text-center text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              ))}
            </div>
            <p className="text-center font-bold text-sm text-gray-500 mt-3">
              {t("Didn’t received OTP?")}{" "}
              <button
                type="button"
                onClick={handleResend}
                className="text-primary hover:underline cursor-pointer"
              >
                {t("Resend it")}
              </button>
            </p>

            <div className="pt-3">
              <label className="block mb-2 text-md font-bold">
                {t("createNewPassword")}
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
                {t("reEnterNewPass")}
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

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
            >
              {t("submit")}
            </button>
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
