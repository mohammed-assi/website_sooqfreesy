import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import harrier from "../../assets/image/Harrier.png";
import lambo from "../../assets/image/car.webp";

export const ImageSlider = () => {
  const items = [
    { title: "Harrier", subtitle: "Adventure X", imageUrl: harrier },
    { title: "Lamborghini", subtitle: "Revuelto", imageUrl: lambo },
  ];

  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
      }}
      navigation={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      modules={[Pagination, Navigation, Autoplay]}
      className="mySwiper image-slider"
    >
      {items.map((item, i) => (
        <SwiperSlide key={i}>
          <div
            className="w-full lg:h-100 bg-cover bg-center relative flex"
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          >
            <div className="spacer-x w-full flex flex-col justify-end text-center text-white md:text-left h-full py-20">
              <h1 className="image-heading font-heading font-bold text-3xl md:text-6xl drop-shadow-lg">
                {item.title}
              </h1>
              <h2 className="image-subheading font-heading font-black text-4xl md:text-7xl">
                {item.subtitle}
              </h2>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
