import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AuthModal } from "../../common/modal/AuthModal";
import LoadingButton from "../../common/loadingButton/LoadingButton";

export const OtpVerificationModal = ({
  show,
  hide,
  activeTab,
  handleSubmit,
  text,
  code,
  setCode,
  handleResend,
  loading,
  timer,
}) => {
  const { t } = useTranslation();
  const inputsRef = useRef([]);

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
        }}
        title={
          activeTab === 1
            ? t("phoneVerificationTitle")
            : t("emailVerificationTitle")
        }
        subtitle={
          activeTab === 1
            ? `${t("phoneVerificationSubtitle")} ${text}`
            : `${t("emailVerificationSubtitle")} ${text}`
        }
      >
        <div className="flex h-full items-center justify-center">
          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex justify-between gap-2">
                {code?.map((digit, index) => (
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

              <LoadingButton
                type="submit"
                loading={loading}
                disabled={loading}
                className="bg-primary text-white hover:bg-primaryDark max-w-[354px] mt-3 h-[54px]"
              >
                {t("verify")}
              </LoadingButton>
            </form>

            <p className="text-center font-bold text-sm mt-10 text-gray-500 mt-6">
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
                  disabled={loading}
                  className="text-primary hover:underline cursor-pointer disabled:opacity-50"
                >
                  {t("resendIt")}
                </button>
              )}
            </p>
          </div>
        </div>
      </AuthModal>
    </>
  );
};
