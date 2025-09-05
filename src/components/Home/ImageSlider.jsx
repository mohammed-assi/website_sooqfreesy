import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
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
      modules={[Pagination, Navigation]}
      className="mySwiper"
    >
      {items.map((item, i) => (
        <SwiperSlide key={i}>
          <div
            className="w-full h-100 bg-cover bg-center relative flex"
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          >
            <div className="spacer-x flex flex-col justify-center items-start text-left h-full ">
              <h1 className="image-heading drop-shadow-lg">{item.title}</h1>
              <h2 className="image-subheading">{item.subtitle}</h2>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
