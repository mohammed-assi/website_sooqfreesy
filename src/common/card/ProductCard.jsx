// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { Pagination } from "swiper/modules";
// import wishlist from "../../assets/icon/whiteHeart.svg";
// import heartFilled from "../../assets/icon/heartFilled.svg";
// import location from "../../assets/icon/silverLocation.svg";
// import { Link } from "react-router-dom";
// import { ROUTE } from "../../config/constants";
// import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";
// import CountryFlags from "../countryFlags/CountryFlags";

// export const ProductCard = ({ item, imagePath, handleLikeUnlikePost }) => {
//   const { t } = useTranslation();

//   const currency = useSelector((state) => state.currency.value);
//   return (
//     <div className="bg-white rounded-xl overflow-hidden relative">
//       {/* <Swiper
//         pagination={{
//           dynamicBullets: true,
//         }}
//         modules={[Pagination]}
//       >
//         {item?.images?.map((img, i) => (
//           <SwiperSlide key={i}>
//             <img
//               src={`${imagePath}/${img.image_url}`}
//               alt={item.title}
//               className="w-full h-48 object-cover"
//             />
//           </SwiperSlide>
//         ))}
//       </Swiper> */}

//       {item?.images?.length > 0 ? (
//         <Swiper pagination={{ dynamicBullets: true }} modules={[Pagination]}>
//           {item.images.map((img, i) => (
//             <SwiperSlide key={i}>
//               <img
//                 src={`${imagePath}/${img.image_url}`}
//                 alt={item.title}
//                 className="w-full h-48 object-cover"
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       ) : (
//         <div className="w-full h-48 flex items-center justify-center bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md">
//           <span className="text-gray-500 text-sm">{t("noImages")}</span>
//         </div>
//       )}

//       <button
//         onClick={() => handleLikeUnlikePost(item)}
//         className="cursor-pointer absolute top-3 right-3 z-9"
//       >
//         {item?.isWishlisted ? (
//           <img src={heartFilled} alt="icon" />
//         ) : (
//           <img src={wishlist} alt="icon" />
//         )}
//       </button>

//       <Link to={`${ROUTE.PRODUCT_PAGE}/${item?.id}`}>
//         <div className="py-4 space-y-2">
//           <div className="flex items-center justify-between">
//             <p className="text-lg font-bold">
//               {currency === "SYP" ? "SYP" : "$"} {item?.price}
//             </p>
//             <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
//               {item?.sub_categoryName}
//             </span>
//           </div>
//           <div className="text-start space-y-1">
//             <h3 className="font-semibold">{item?.title}</h3>
//             <p className="text-sm text-gray-800">
//               {" "}
//               {item?.description?.length > 50
//                 ? `${item.description.slice(0, 50)}...`
//                 : item.description}
//             </p>
//             <div className="flex justify-between items-center mt-3">
//               <div className="w-70 flex items-center gap-2 text-gray-500 text-xs capitalize">
//                 <img src={location} alt="icon" />
//                 {item?.nearby_location}
//               </div>
//               <div className="flex items-center gap-2">
//                 <CountryFlags
//                   countryName={item?.countryNameForFlag}
//                   countryCode={item?.countryCodeForFlag}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import wishlist from "../../assets/icon/whiteHeart.svg";
import heartFilled from "../../assets/icon/heartFilled.svg";
import location from "../../assets/icon/silverLocation.svg";
import { Link } from "react-router-dom";
import { ROUTE } from "../../config/constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CountryFlags from "../countryFlags/CountryFlags";

export const ProductCard = ({ item, imagePath, handleLikeUnlikePost }) => {
  const { t } = useTranslation();
  const currency = useSelector((state) => state.currency.value);

  return (
    <div className="bg-white rounded-xl overflow-hidden relative h-full flex flex-col shadow-sm">
      {item?.images?.length > 0 ? (
        <div className="w-full h-48">
          <Swiper pagination={{ dynamicBullets: true }} modules={[Pagination]}>
            {item.images.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={`${imagePath}/${img.image_url}`}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="w-full h-48 flex items-center justify-center bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200">
          <span className="text-gray-500 text-sm">{t("noImages")}</span>
        </div>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleLikeUnlikePost(item);
        }}
        className="cursor-pointer absolute top-3 right-3 z-10"
        aria-label="wishlist"
      >
        {item?.isWishlisted ? (
          <img src={heartFilled} alt="icon" />
        ) : (
          <img src={wishlist} alt="icon" />
        )}
      </button>

      <Link to={`${ROUTE.PRODUCT_PAGE}/${item?.id}`} className="flex-1 block">
        <div className="py-4 px-4 flex flex-col h-full">
          <div className="flex items-center justify-end">
            <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
              {item?.sub_categoryName}
            </span>
          </div>
          <div className="flex items-start justify-start mt-2">
            {/* <p className="text-lg font-bold">
              {currency === "SYP" ? "SYP" : "$"} {item?.price}
            </p> */}
            <p className="text-lg font-bold">
              <span dir="ltr" className="inline-block ">
                <span className="mr-1">{currency === "SYP" ? "SYP" : "$"}</span>
                <span className="break-all">{item?.price}</span>
              </span>
            </p>
          </div>

          <div className="text-start mt-2 flex-1">
            <h3
              className="font-semibold text-sm leading-tight mb-1
                         overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {item?.title}
            </h3>

            <p
              className="text-sm text-gray-800"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item?.description}
            </p>
          </div>

          <div className="flex justify-between items-center mt-3 pt-2 border-t border-transparent">
            <div className="flex items-center gap-2 text-gray-500 text-xs capitalize truncate">
              <img src={location} alt="icon" className="w-4 h-4" />
              <span className="truncate max-w-[11rem]">
                {item?.nearby_location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CountryFlags
                countryName={item?.countryNameForFlag}
                countryCode={item?.countryCodeForFlag}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
