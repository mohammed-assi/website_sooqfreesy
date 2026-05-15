import { useTranslation } from "react-i18next";
import authImage from "../../assets/image/authModalImage.png";

export const AuthModal = ({ show, hide, title, subtitle, children }) => {
  const { i18n } = useTranslation();
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 px-3 py-6 overflow-y-auto flex items-start justify-center"
      onClick={hide}
    >
      <div
        className="bg-white w-full max-w-[1000px] rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row relative mx-auto lg:my-auto my-30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={hide}
          className={`${
            i18n.language === "ar" ? "lg:left-10 left-3" : "lg:right-10 right-3"
          } absolute lg:top-10 top-3 text-gray-500 hover:text-gray-700 cursor-pointer z-10`}
        >
          <i className="fa-solid fa-xmark fa-lg" />
        </button>

        {/* Left panel â€” desktop only */}
        <div className="hidden lg:flex flex-col justify-between bg-primary text-white w-[350px] flex-shrink-0">
          <div className="text-start py-12 px-8">
            <h2 className="mb-2 text-[38px] font-bold">{title}</h2>
            <p className="text-base">{subtitle}</p>
          </div>
          <img
            src={authImage}
            alt="Auth"
            className="w-full h-[50%] object-cover"
          />
        </div>

        {/* Right panel â€” scrollable form */}
        <div className="w-full lg:w-auto lg:flex-1 overflow-y-auto lg:px-[68px] lg:pt-[70px] lg:pb-[50px] p-5 pt-10">
          {/* Title visible on mobile/tablet only */}
          <div className="lg:hidden mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
