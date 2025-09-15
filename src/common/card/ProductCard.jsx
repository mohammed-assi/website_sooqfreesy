import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import wishlist from "../../assets/icon/whiteHeart.svg";
import heartFilled from "../../assets/icon/heartFilled.svg";
import location from "../../assets/icon/silverLocation.svg";
import { Link } from "react-router-dom";
import { ROUTE } from "../../config/constants";

export const ProductCard = ({ item, imagePath, handleLikeUnlikePost }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden relative">
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
      >
        {item?.images?.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={`${imagePath}/${img.image_url}`}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={() => handleLikeUnlikePost(item)}
        className="cursor-pointer absolute top-3 right-3 z-9"
      >
        {item?.isWishlisted ? (
          <img src={heartFilled} alt="icon" />
        ) : (
          <img src={wishlist} alt="icon" />
        )}
      </button>

      <Link to={`${ROUTE.PRODUCT_PAGE}/${item?.id}`}>
        <div className="py-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">£{item?.price}</p>
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
              {item?.sub_categoryName}
            </span>
          </div>
          <div className="text-start space-y-1">
            <h3 className="font-semibold">{item?.title}</h3>
            <p className="text-sm text-gray-800">{item?.description}</p>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
              <img src={location} alt="icon" />
              {item?.nearby_location}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
