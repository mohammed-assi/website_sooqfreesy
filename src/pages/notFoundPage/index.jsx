import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../config/constants";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-100 bg-gray-50 px-4 text-center">
      {/* <div className="max-w-lg w-full mb-8">
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble-404.png"
          alt="404 Not Found"
          className="w-full object-contain"
        />
      </div> */}

      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">404</h1>
      <p className="text-xl md:text-xl text-gray-600 mb-6">{t("oops")}</p>

      <button
        onClick={() => navigate(ROUTE.ROOT)}
        className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primaryDark transition"
      >
        {t("gotohome")}
      </button>
    </div>
  );
};

export default NotFoundPage;
