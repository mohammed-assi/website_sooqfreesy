import { useTranslation } from "react-i18next";
import authImage from "../../assets/image/authModalImage.png";

export const AuthModal = ({ show, hide, title, subtitle, children }) => {
  const { i18n } = useTranslation();
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
      <div className="w-full flex justify-center ">
        <div className="relative w-full my-10 max-h-[100dvh] py-[30px] overflow-y-auto">
          <div className="bg-white w-full max-w-[1000px] rounded-xl shadow-lg overflow-hidden flex relative mx-auto">
            <button
              onClick={hide}
              className={`${
                i18n.language === "ar" ? "lg:left-10 left-2" : "lg:right-10 right-2"
              } absolute lg:top-10 top-2 text-gray-500 hover:text-gray-700 cursor-pointer`}
            >
              <i className="fa-solid fa-xmark fa-lg" />
            </button>

            <div className="hidden md:flex flex-col justify-between bg-primary text-white w-[350px] flex-shrink-0">
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

            <div className="w-full md:w-2/3 lg:px-[68px] lg:pt-[70px] lg:pb-[50px] p-3 py-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
