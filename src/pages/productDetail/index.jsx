import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import audi from "../../assets/image/audi.png";
import verna from "../../assets/image/verna.png";
import ferrari from "../../assets/image/ferrari.png";
import office from "../../assets/image/office.png";
import building from "../../assets/image/building.png";
import iphone from "../../assets/image/iphone.png";
import mixer from "../../assets/image/mixer.png";
import machine from "../../assets/image/machine.png";
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
import { Link } from "react-router-dom";
import { ROUTE } from "../../config/constants";
import { InfoModal } from "../../common/modal/InfoModal";
import { ReportListModal } from "../../components/productDetails/ReportListModal";

export const ProductDetail = () => {
  const { t } = useTranslation();
  const cars = [
    {
      id: 1,
      price: "£3500",
      title: "Hyundai Verna",
      description: "Audi Silver 1K km",
      location: "Palmyra",
      category: t("cars"),
      images: [audi, verna, ferrari],
      liked: false
    },

    {
      id: 2,
      price: "£3500",
      title: "Washing Machine",
      description: "White 2K km",
      location: "Palmyra",
      category: t("appliances"),
      images: [machine, mixer],
      liked: false
    },

    {
      id: 3,
      price: "£4000",
      title: "Honda Civic",
      description: "White 2K km",
      location: "Palmyra",
      category: t("cars"),
      images: [verna, audi],
      liked: false
    },

    {
      id: 4,
      price: "£3000",
      title: "Commercial Office",
      description: "White 2K km",
      location: "Palmyra",
      category: t("property"),
      images: [office, building],
      liked: false
    },
    {
      id: 5,
      price: "£4500",
      title: "Kitchen Mixer",
      description: "White 2K km",
      location: "Palmyra",
      category: t("appliances"),
      images: [mixer, machine],
      liked: false
    },

    {
      id: 6,
      price: "£5500",
      title: "Ferrari Enzo",
      description: "White 2K km",
      location: "Palmyra",
      category: t("cars"),
      images: [ferrari, audi],
      liked: false
    },

    {
      id: 7,
      price: "£2500",
      title: "iPhone X",
      description: "White 2K km",
      location: "Palmyra",
      category: t("electronics"),
      images: [iphone, machine],
      liked: false
    },

    {
      id: 8,
      price: "£5500",
      title: "Compound Building",
      description: "White 2K km",
      location: "Palmyra",
      category: t("property"),
      images: [building, office],
      liked: false
    },
  ];
  const imagesss = [building1, building3, building4, building5];
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showReportListModal, setShowReportListModal] = useState(false);
  return (
    <div className="spacer-x">
      <div className="pt-15">
        <div className="text-sm text-gray-500 mb-2">
          {t("home")} <span className="mx-1">{">"}</span> Real Estate{" "}
          <span className="mx-1">{">"}</span> Product Details
        </div>

        <h1 className="main-heading">Compound Spaces</h1>

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
              <h2 className="main-heading text-primary">£5000000</h2>
              <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                Property
              </span>
            </div>

            <p className="text-sm text-gray-700">
              Lorem ipsum dolor sit amet consectetur. Sodales turpis sit nunc
              dui. Aliquam urna a at ullamcorper faucibus...
            </p>

            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <img src={location} alt="icon" />
              Palmyra
            </div>

            <button
              onClick={() => setShowNotifyModal(true)}
              className="w-full p-3 font-bold text-primary underline rounded-lg flex items-center justify-center gap-2 bg-gray-200"
            >
              <img src={primaryBell} alt="icon" /> Notify me when price drops
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
              <img src={report} alt="icon" /> Report this Listing
            </button>
          </div>
        </div>

        <div className="py-6 overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-2/3 w-full">
            <h3 className="font-bold text-xl">Description</h3>
            <p className="text-gray-600 py-2">
              Lorem ipsum dolor sit amet consectetur. Dignissim curabitur
              fermentum at dui cursus vel enim. Sem pulvinar ut diam nunc eu et
              mauris. Nunc arcu dui a nulla tellus euismod vitae.{" "}
            </p>
            <p className="text-gray-600 py-2">Lorem ipsum: Sem pulvinar</p>
            <p className="text-gray-600 py-2">Lorem: Pulvinar</p>
            <p className="text-gray-600 py-2">Ipsum: Sem</p>
            <p className="text-gray-600 py-2">Lorem: Pulvinar</p>
            <p className="text-gray-600 py-2">
              Tempus viverra proin eget mus dignissim imperdiet vitae. Venenatis
              magnis risus id arcu malesuada tempor. Dictum in ut ornare eu
              amet. Enim amet lobortis pulvinar dis. Pulvinar neque vestibulum
              nunc laoreet.
            </p>
            <p className="text-gray-600 py-2">
              Nunc id tellus posuere nunc aliquam tortor in.
            </p>
            <p className="text-gray-600 py-2">
              Enim mauris ullamcorper netus non urna. Orci malesuada lectus et
              turpis nunc ornare feugiat mattis purus. Leo a interdum sagittis
              in. Felis quis egestas massa tincidunt. Id est quis duis dui nunc
              in praesent semper. Mus bibendum faucibus vitae nisi venenatis
              integer pretium purus.
            </p>
            <p className="text-gray-600 py-2">
              Convallis mi suspendisse mi in nunc ut. Dui neque dignissim justo
              lectus.
            </p>
            <p className="text-gray-600 py-2">
              Pellentesque nunc quam egestas quisque facilisi nec etiam ac
              rhoncus. Ut pulvinar arcu sed nunc. Et risus aliquet eget
              ultrices. Habitant id amet eget convallis. Vitae iaculis aenean
              diam ultricies purus consequat mi lobortis. Lacinia ac tellus
              dolor id cursus nibh.
            </p>
            <p className="text-gray-600 py-2">
              Pharetra eget aliquet varius etiam sit amet lectus id. Sem in
              commodo at nunc ultrices pretium nunc sit.
            </p>
          </div>
          <div className="lg:w-1/3 w-full ps-5 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <img src={darkLocation} alt="icon" />
                <h3 className="font-bold text-xl">Campground, Palmyra</h3>
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
              <h3 className="font-bold text-xl">Post Owner</h3>
              <div className="flex items-center gap-3">
                <div className="w-40 h-40 rounded flex items-center justify-center">
                  <img src={defaultUser} alt="icon" className="h-full w-full" />
                </div>
                <Link to={ROUTE.SELLER_PROFILE}>
                  <h3 className="text-xl font-bold">Anwar Ali</h3>
                  <RatingStar starValue={4.5} />
                  <p className="text-sm text-gray-500">
                    Member since 14/01/2025
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
                  <img src={whitestar} alt="icon" className="h-5 w-5" /> Add
                  Reviews
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-8">
          <div className="flex justify-between items-center pb-4">
            <h2 className="main-heading">Similar Posts</h2>
            <h2 className="font-bold text-md">View All</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car) => (
              <ProductCard key={car.id} item={car} />
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
          title="Request Submitted!"
          subtitle="Your price request has been successfully submitted."
        />
      )}
      {showReportListModal && (
        <ReportListModal onClose={() => setShowReportListModal(false)} />
      )}
    </div>
  );
};
