import { useEffect, useRef, useState } from "react";
import location from "../../../../assets/icon/silverLocation.svg";
import menu from "../../../../assets/icon/menu.svg";
import marksold from "../../../../assets/icon/marksold.svg";
import edit from "../../../../assets/icon/edit.svg";
import deleteIcon from "../../../../assets/icon/delete.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTE } from "../../../../config/constants";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import CountryFlags from "../../../../common/countryFlags/CountryFlags";

const MyAdsCard = ({
  item,
  imagePath,
  handleOpenDeleteModal,
  handleMarkSoldPost,
  activeTab,
}) => {
  const { i18n, t } = useTranslation();
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [showMenuItem, setShowMenuItem] = useState(false);
  const currency = useSelector((state) => state.currency.value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenuItem(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-hidden">
      <div className="relative w-full md:w-3/6">
        {item?.images?.length > 0 ? (
          <Swiper pagination={{ dynamicBullets: true }} modules={[Pagination]}>
            {item.images.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`${imagePath}/${img.image_url}`}
                  alt={item.title}
                  className="w-full h-60 object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-60 flex items-center justify-center bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl">
            <span className="text-gray-500 text-sm">{t("noImages")}</span>
          </div>
        )}
      </div>

      <div className="w-full md:w-3/6 p-4 relative">
        <Link to={`${ROUTE.PRODUCT_PAGE}/${item.id}`}>
          <h2 className="text-2xl font-bold text-gray-900">
            <span dir="ltr" className="inline-block">
              <span className="mr-1">{currency === "SYP" ? "SYP" : "$"}</span>
              <span>{item?.price}</span>
            </span>
          </h2>

          <h3 className="text-xl font-bold text-gray-800 mt-3">{item.title}</h3>

          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
            {item.description}
          </p>

          <div className="flex justify-between items-center mt-3">
            <div className="w-80 flex items-center gap-2 text-gray-500 text-sm pt-2">
              <img src={location} alt="icon" />
              {item.nearby_location}
            </div>
            <div className="flex items-center gap-2">
              <CountryFlags
                countryName={item?.countryNameForFlag}
                countryCode={item?.countryCodeForFlag}
              />
            </div>
          </div>
          <p className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full mt-2 inline-block">
            {item.sub_categoryName}
          </p>
          {activeTab === 0 && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
              {t("created")}: {moment(item.created_at).format("MM/DD/yyyy")}
            </p>
          )}
          {activeTab === 1 && item.updated_at && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
              {t("update")}: {moment(item.updated_at).format("MM/DD/yyyy")}
            </p>
          )}
          {activeTab === 2 && item.updated_at && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
              {t("rejectAt")}: {moment(item.updated_at).format("MM/DD/yyyy")}
            </p>
          )}
          {activeTab === 3 && item.updated_at && (
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
              {t("soldAt")}: {moment(item.updated_at).format("MM/DD/yyyy")}
            </p>
          )}
        </Link>
        <button
          onClick={() => setShowMenuItem(true)}
          className={`${i18n?.language === "ar" ? "left-3" : "right-3"}
            absolute top-4`}
        >
          <img src={menu} alt="icon" />
        </button>
        {showMenuItem && (
          <div
            ref={menuRef}
            className={`${
              i18n?.language === "ar" ? "left-3" : "right-3"
            } absolute top-4 bg-white shadow-xl py-3 px-2 rounded-lg m-w-33`}
          >
            <ul className="space-y-2">
              <li
                onClick={() => handleOpenDeleteModal(item.id)}
                className={`text-gray-700 flex items-center cursor-pointer px-2 py-1 hover:text-black border-b border-gray-200 gap-3`}
              >
                <img src={deleteIcon} alt="icon" />
                <span>{t("delete")}</span>
              </li>
              {(activeTab === 0 || activeTab === 2) && (
                <li
                  onClick={() => {
                    navigate(`${ROUTE.UPDATE_POST}/${item.id}`, {
                      state: { showFinalForm: true },
                    });
                  }}
                  className={`text-gray-700 flex items-center cursor-pointer px-2 py-1 hover:text-black border-b border-gray-200 gap-3`}
                >
                  <img src={edit} alt="icon" /> <span>{t("edit")}</span>
                </li>
              )}
              {activeTab === 1 && (
                <li
                  onClick={() => handleMarkSoldPost(item.id)}
                  className={`text-gray-700 flex items-center cursor-pointer px-2 py-1 hover:text-black gap-3`}
                >
                  <img src={marksold} alt="icon" /> <span>{t("markSold")}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAdsCard;
