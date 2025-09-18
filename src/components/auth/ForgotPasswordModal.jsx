import { useEffect, useState } from "react";
import { AuthModal } from "../../common/modal/AuthModal";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import "react-phone-input-2/lib/style.css";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ResetPassOtpModal } from "./ResetPassOtpModal";
import { AuthConfirmationModal } from "../../common/modal/AuthConfirmationModal";
import { postRequest } from "../../config/apiFunctions";
import { AUTH } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import LoadingButton from "../../common/loadingButton/LoadingButton";

function ForgotPasswordModal({
  show,
  hide,
  setShowRegisterModal,
  setShowLoginModal,
}) {
  const { t } = useTranslation();
  const [showResetPassModal, setShowResetPassModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .required(t("emailRequired"))
      .email(t("validEmail"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("validEmail")
      ),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOpenRegisterModal = () => {
    hide();
    setShowRegisterModal(true);
  };

  const handleCloseConfirmationModal = () => {
    setShowResetPassModal(true);
    hide();
    setShowConfirmationModal(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setUserEmail(data.email);
    const payload = {
      email: data.email,
    };
    try {
      const response = await postRequest(AUTH.FORGOT_PASSWORD, payload);
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
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const payload = {
      email: userEmail,
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
        }}
        title={t("forgotPasswordTitle")}
        subtitle={t("forgotPasswordSubtitle")}
      >
        <div className="flex flex-col justify-between h-100%">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block mb-2 text-base text-black font-bold">
                {t("enterEmail")}
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full rounded-md h-[48px] px-5 py-2 bg-gray-100 focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <LoadingButton
              type="submit"
              loading={loading}
              disabled={loading}
              className="rounded-md bg-primary text-white hover:bg-primaryDark h-[56px]"
            >
              {t("submit")}
            </LoadingButton>
          </form>

          <p className="text-center font-bold text-sm text-gray-500 mt-6">
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

      <ResetPassOtpModal
        show={showResetPassModal}
        hide={() => setShowResetPassModal(false)}
        userEmail={userEmail}
        setShowLoginModal={setShowLoginModal}
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
}

export default ForgotPasswordModal;
