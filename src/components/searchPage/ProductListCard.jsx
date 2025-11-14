import wishlist from "../../assets/icon/whiteHeart.svg";
import location from "../../assets/icon/silverLocation.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import heartFilled from "../../assets/icon/heartFilled.svg";
import { Link } from "react-router-dom";
import { ROUTE } from "../../config/constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CountryFlags from "../../common/countryFlags/CountryFlags";

const ProductListCard = ({
  item,
  imagePath,
  handleLikeUnlikePost,
  showWishlist,
}) => {
  const { i18n, t } = useTranslation();
  const currency = useSelector((state) => state.currency.value);
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm border border-gray-200 p-2 overflow-hidden">
      <div className="relative w-full md:w-3/6">
        {/* <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
        >
          {item?.images?.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={`${imagePath}/${img.image_url}`}
                alt={item.title}
                className="w-full h-60 object-cover rounded-xl"
              />
            </SwiperSlide>
          ))}
        </Swiper> */}
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

        {showWishlist && (
          <button
            onClick={() => handleLikeUnlikePost(item)}
            className="cursor-pointer absolute top-4 right-3 z-9"
          >
            {item.isWishlisted ? (
              <img src={heartFilled} alt="icon" />
            ) : (
              <img src={wishlist} alt="icon" />
            )}
          </button>
        )}
      </div>

      <div className="w-full md:w-3/6 p-4 relative">
        <Link to={`${ROUTE.PRODUCT_PAGE}/${item.id}`}>
          <span
            className={`${
              i18n.language === "ar" ? "left-3" : "right-3"
            } absolute top-3  bg-primary text-white text-xs font-medium px-3 py-1 rounded-full`}
          >
            {item.sub_categoryName}
          </span>

          <h2 className="text-2xl font-bold text-gray-900">
            <span dir="ltr" className="inline-block">
              <span className="mr-1">{currency === "SYP" ? "SYP" : "$"}</span>
              <span>{item?.price}</span>
            </span>
          </h2>

          <h3 className="text-xl font-bold text-gray-800 mt-3">{item.title}</h3>

          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
            {item?.description?.length > 50
              ? `${item.description.slice(0, 60)}...`
              : item.description}
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
        </Link>
      </div>
    </div>
  );
};

export default ProductListCard;
