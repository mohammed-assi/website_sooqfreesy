import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import wishlist from "../../assets/icon/whiteHeart.svg";
import location from "../../assets/icon/silverLocation.svg";

export const ProductCard = ({ item }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden relative">
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
      >
        {item.images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="cursor-pointer absolute top-3 right-3 z-9">
        <img src={wishlist} alt="icon" />
      </button>

      <div className="py-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">{item.price}</p>
          <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
            {item.category}
          </span>
        </div>
        <div className="text-start">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-800">{item.description}</p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <img src={location} alt="icon" />
            {item.location}
          </div>
        </div>
      </div>
    </div>
  );
};
