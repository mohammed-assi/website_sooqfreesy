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
import ProductListCard from "../searchPage/ProductListCard";
import { SideFilter } from "../searchPage/SideFilter";
import filterIcon from "../../assets/icon/filterIcon.svg";
import { FilterModal } from "../searchPage/FilterModal";
import { SellerReviews } from "./SellerReviews";
import RatingSummary from "./RatingSummary";

export const ListingFilter = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("listing");
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filters, setFilters] = useState({});

  console.log("filters", filters);

  const tabs = [
    { id: "listing", label: t("Listing") },
    { id: "reviews", label: t("Reviews") },
  ];
  const cars = [
    {
      id: 1,
      price: "£3500",
      title: "Hyundai Verna",
      description: "Audi Silver 1K km",
      location: "Palmyra",
      category: t("cars"),
      images: [audi, verna, ferrari],
    },

    {
      id: 2,
      price: "£3500",
      title: "Washing Machine",
      description: "White 2K km",
      location: "Palmyra",
      category: t("appliances"),
      images: [machine, mixer],
    },

    {
      id: 3,
      price: "£4000",
      title: "Honda Civic",
      description: "White 2K km",
      location: "Palmyra",
      category: t("cars"),
      images: [verna, audi],
    },

    {
      id: 4,
      price: "£3000",
      title: "Commercial Office",
      description: "White 2K km",
      location: "Palmyra",
      category: t("property"),
      images: [office, building],
    },
    {
      id: 5,
      price: "£4500",
      title: "Kitchen Mixer",
      description: "White 2K km",
      location: "Palmyra",
      category: t("appliances"),
      images: [mixer, machine],
    },

    {
      id: 6,
      price: "£5500",
      title: "Ferrari Enzo",
      description: "White 2K km",
      location: "Palmyra",
      category: t("cars"),
      images: [ferrari, audi],
    },

    {
      id: 7,
      price: "£2500",
      title: "iPhone X",
      description: "White 2K km",
      location: "Palmyra",
      category: t("electronics"),
      images: [iphone, machine],
    },

    {
      id: 8,
      price: "£5500",
      title: "Compound Building",
      description: "White 2K km",
      location: "Palmyra",
      category: t("property"),
      images: [building, office],
    },
  ];

  const breakdown = {
    5: 80,
    4: 20,
    3: 10,
    2: 5,
    1: 5,
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="flex">
          {tabs.map((tab) => (
            <p
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative cursor-pointer pb-2 px-10 text-lg font-semibold  transition-colors ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              {tab.label}
              <span
                className={`absolute left-0 -bottom-[1px] h-[1px] w-full rounded-full transition-colors ${
                  activeTab === tab.id ? "bg-primary h-[2px]" : "bg-gray-300"
                }`}
              />
            </p>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <p className="text-lg text-gray-600">Sorting</p>
          <button
            onClick={() => setOpenFilterModal(true)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <img src={filterIcon} alt="Filter" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="pt-8">
        {activeTab === "listing" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <SideFilter />
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-6">
                {cars.map((car) => (
                  <ProductListCard key={car.id} item={car} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] gap-6">
            <aside className="space-y-6">
              <RatingSummary
                average={4.5}
                totalReviews={120}
                breakdown={breakdown}
              />
            </aside>

            <div>
              <SellerReviews />
            </div>
          </div>
        )}
      </div>
      <FilterModal
        isOpen={openFilterModal}
        onClose={() => setOpenFilterModal(false)}
        onApply={(values) => {
          setFilters(values);
          setOpenFilterModal(false);
        }}
      />
    </div>
  );
};
