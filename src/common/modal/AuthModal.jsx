import authImage from "../../assets/image/authModalImage.png";

export const AuthModal = ({ show, hide, title, subtitle, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full flex justify-center ">
        <div className="relative w-full my-10 max-h-[100dvh] py-[30px] overflow-y-auto">
      <div className="bg-white w-full max-w-[1000px] rounded-xl shadow-lg overflow-hidden flex relative mx-auto">
        <button
          onClick={hide}
          className="absolute top-10 right-10 text-gray-500 hover:text-gray-700 cursor-pointer"
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

        <div className="w-full md:w-2/3 px-[68px] pt-[70px] pb-[50px]">{children}</div>
      </div>
      </div>
      </div>
    </div>
  );
};
