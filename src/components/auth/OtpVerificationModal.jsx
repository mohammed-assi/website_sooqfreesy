import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { AuthModal } from "../../common/modal/AuthModal";

export const OtpVerificationModal = ({
  show,
  hide,
  activeTab,
  handleSubmit,
  text,
  code,
  setCode,
  handleResend,
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
          <div className="px-10 py-8">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex justify-between gap-4">
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
                    className="w-12 h-12 text-center text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition"
              >
                {t("Verify")}
              </button>
            </form>

            <p className="text-center font-bold text-sm text-gray-500 mt-6">
              {t("Didn’t received OTP?")}{" "}
              <button
                onClick={handleResend}
                className="text-primary hover:underline cursor-pointer"
              >
                {t("Resend it")}
              </button>
            </p>
          </div>
        </div>
      </AuthModal>
    </>
  );
};
