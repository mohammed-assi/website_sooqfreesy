import authImage from "../../assets/image/authModalImage.png";

export const AuthModal = ({ show, hide, title, subtitle, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg overflow-hidden flex relative">
        <button
          onClick={hide}
          className="absolute top-10 right-10 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <i className="fa-solid fa-xmark fa-lg" />
        </button>

        <div className="hidden md:flex flex-col bg-primary text-white w-1/3">
          <div className="text-start py-12 px-8">
            <h2 className="main-heading mb-2">{title}</h2>
            <p className="text-sm">{subtitle}</p>
          </div>
          <img
            src={authImage}
            alt="Auth"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-2/3 p-8">{children}</div>
      </div>
    </div>
  );
};
