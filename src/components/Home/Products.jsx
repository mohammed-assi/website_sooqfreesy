import { useState } from "react";
import { useTranslation } from "react-i18next";
import audi from "../../assets/image/audi.png";
import verna from "../../assets/image/verna.png";
import ferrari from "../../assets/image/ferrari.png";
import office from "../../assets/image/office.png";
import building from "../../assets/image/building.png";
import iphone from "../../assets/image/iphone.png";
import mixer from "../../assets/image/mixer.png";
import machine from "../../assets/image/machine.png";
import { ProductCard } from "../../common/card/ProductCard";

export const Products = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("forYou");

  const tabs = [
    { id: "forYou", label: t("forYou") },
    { id: "nearby", label: t("nearby") },
    { id: "worldwide", label: t("worldwide") },
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

  return (
    <div className="spacer-x py-20">
      <div className="w-full">
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

        <div className="pt-8 text-center">
          {(activeTab === "forYou" ||
            activeTab === "nearby" ||
            activeTab === "worldwide") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cars.map((car) => (
                <ProductCard key={car.id} item={car}/>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-12">
        <h3 className="main-heading">{t("welcomeSyria")}</h3>
        <p className="text-gray-500">{t("welcomeSyriaIntro")}</p>
      </div>
    </div>
  );
};
