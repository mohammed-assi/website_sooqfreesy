import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import building1 from "../../assets/image/building1.png";
import building3 from "../../assets/image/building3.png";
import building4 from "../../assets/image/building4.png";
import building5 from "../../assets/image/building5.png";
import eyeIcon from "../../assets/icon/eye.svg";
import shareIcon from "../../assets/icon/share.svg";
import heart from "../../assets/icon/wishlist.svg";
import location from "../../assets/icon/silverLocation.svg";
import darkLocation from "../../assets/icon/darkLocation.svg";
import primaryBell from "../../assets/icon/primaryBell.svg";
import bed from "../../assets/icon/bed.svg";
import sofa from "../../assets/icon/sofa.svg";
import pool from "../../assets/icon/pool.svg";
import area from "../../assets/icon/area.svg";
import floor from "../../assets/icon/floor.svg";
import calendar from "../../assets/icon/calendar.svg";
import report from "../../assets/icon/report.svg";
import whitestar from "../../assets/icon/whitestar.svg";
import defaultUser from "../../assets/icon/defaultUser.svg";
import headerContact from "../../assets/icon/headerContact.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { ProductCard } from "../../common/card/ProductCard";
import { AddReviewModal } from "../../components/productDetails/AddReviewModal";
import RatingStar from "../../common/ratingStar/RatingStar";
import { Link, useParams } from "react-router-dom";
import { ROUTE } from "../../config/constants";
import { InfoModal } from "../../common/modal/InfoModal";
import { ReportListModal } from "../../components/productDetails/ReportListModal";
import { getRequest } from "../../config/apiFunctions";
import { POST } from "../../config/endPoints";

export const ProductDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const imagesss = [building1, building3, building4, building5];
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showReportListModal, setShowReportListModal] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [postDetailData, setPostDetailData] = useState({});

  const getAllPosts = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setAllPosts(response?.data?.data?.posts);
    }
  };

  const getPostDeatils = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setPostDetailData(response?.data?.data?.post);
    }
  };

  useEffect(() => {
    getPostDeatils(`${POST.GET_DETAILS}/${id}`);
  }, []);

  useEffect(() => {
    getAllPosts(`${POST.GET_ALL}?page=${1}&limit=8`);
  }, []);

  console.log("postDetailData", postDetailData);

  return (
    <div className="spacer-x">
      <div className="pt-15">
        <div className="text-sm text-gray-500 mb-2">
          {t("home")} <span className="mx-1">{">"}</span> {t("productDetails")}
        </div>

        <h1 className="main-heading">{postDetailData?.title}</h1>

        <div className="py-6 overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-2/3 w-full">
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination]}
            >
              {imagesss.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img}
                    alt="img"
                    className="w-full h-100 object-cover rounded-xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="grid grid-cols-5 gap-2 pt-4">
              {imagesss.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="thumb"
                  className="rounded-lg h-30 object-cover cursor-pointer"
                />
              ))}
              <div className="relative rounded-lg h-30 bg-gray-200 flex items-center justify-center cursor-pointer">
                <span className="text-sm font-medium">+20 more</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 w-full ps-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-md rounded-full px-3 py-1 font-semibold bg-gray-200">
                Listing ID: 123456789
              </span>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1 text-sm">
                  <img src={eyeIcon} alt="icon" />
                  24K
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <img src={shareIcon} alt="icon" />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <img src={heart} alt="icon" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h2 className="main-heading text-primary">
                £{postDetailData?.price}
              </h2>
              <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                {postDetailData?.subCategoryName}
              </span>
            </div>

            <p className="text-sm text-gray-700">
              {postDetailData?.description}
            </p>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <img src={location} alt="icon" />
              {postDetailData?.nearby_location}
            </div>

            <button
              onClick={() => setShowNotifyModal(true)}
              className="w-full p-3 font-bold text-primary underline rounded-lg flex items-center justify-center gap-2 bg-gray-200"
            >
              <img src={primaryBell} alt="icon" /> {t("priceDrops")}
            </button>

            <div className="grid grid-cols-3 gap-3 text-sm text-gray-700">
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={bed} alt="icon" /> 3 Bedrooms
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={sofa} alt="icon" />
                Furnished
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={pool} alt="icon" /> Pool
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={area} alt="icon" />
                214 m2 area
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={floor} alt="icon" />
                2nd Floor
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-gray-200 rounded-lg py-2">
                <img src={calendar} alt="icon" />
                Post: 16/02/2025
              </div>
            </div>

            <button
              onClick={() => setShowReportListModal(true)}
              className="w-full p-3 font-bold text-red-600 rounded-lg flex items-center justify-center gap-2 bg-gray-200"
            >
              <img src={report} alt="icon" /> {t("reportListing")}
            </button>
          </div>
        </div>

        <div className="py-6 overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-2/3 w-full">
            <h3 className="font-bold text-xl">{t("description")}</h3>
            <p className="text-gray-600 py-2">{postDetailData?.description}</p>
          </div>
          <div className="lg:w-1/3 w-full ps-5 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <img src={darkLocation} alt="icon" />
                <h3 className="font-bold text-xl">
                  {postDetailData?.nearby_location}
                </h3>
              </div>
              <div className="w-full h-70 py-2 rounded-lg overflow-hidden shadow">
                <iframe
                  title="Syria Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4371607.270781907!2d35.802118!3d34.802075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15188e58401a2439%3A0x3d7e2f28d5f95170!2sSyria!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            <div className="py-4">
              <h3 className="font-bold text-xl">{t("postOwner")}</h3>
              <div className="flex items-center gap-3">
                <div className="w-40 h-40 rounded flex items-center justify-center">
                  <img src={defaultUser} alt="icon" className="h-full w-full" />
                </div>
                <Link to={ROUTE.SELLER_PROFILE}>
                  <h3 className="text-xl font-bold">Anwar Ali</h3>
                  <RatingStar starValue={4.5} />
                  <p className="text-sm text-gray-500">
                    {t("memberSince")} 14/01/2025
                  </p>
                </Link>
              </div>

              <div className="flex gap-1">
                <button className="flex gap-2 font-bold items-center px-6 py-3 bg-primary rounded-lg text-white hover:bg-primaryDark cursor-pointer transition">
                  <img src={headerContact} alt="icon" className="h-5 w-5" />{" "}
                  9876543210
                </button>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="flex gap-1 font-bold items-center px-6 py-3 bg-primary rounded-lg text-white hover:bg-primaryDark cursor-pointer transition"
                >
                  <img src={whitestar} alt="icon" className="h-5 w-5" />{" "}
                  {t("addReviewsButton")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-8">
          <div className="flex justify-between items-center pb-4">
            <h2 className="main-heading">{t("similarPosts")}</h2>
            <Link to={ROUTE.PRODUCT_PAGE}>
              <h2 className="font-bold text-md">{t("viewAll")}</h2>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allPosts?.map((car) => (
              <ProductCard key={car.id} item={car} imagePath={imagePath} />
            ))}
          </div>
        </div>
      </div>

      {showReviewModal && (
        <AddReviewModal onClose={() => setShowReviewModal(false)} />
      )}

      {showNotifyModal && (
        <InfoModal
          onClose={() => setShowNotifyModal(false)}
          title={t("requestSubmitted")}
          subtitle={t("successfullySubmitted")}
        />
      )}
      {showReportListModal && (
        <ReportListModal onClose={() => setShowReportListModal(false)} />
      )}
    </div>
  );
};
