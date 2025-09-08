import React from "react";
import audi from "../../../assets/image/audi.png";
import verna from "../../../assets/image/verna.png";
import ferrari from "../../../assets/image/ferrari.png";
import office from "../../../assets/image/office.png";
import building from "../../../assets/image/building.png";
import iphone from "../../../assets/image/iphone.png";
import mixer from "../../../assets/image/mixer.png";
import machine from "../../../assets/image/machine.png";
import { useTranslation } from "react-i18next";
import { ProductCard } from "../../../common/card/ProductCard";

export const MyWishlist = () => {
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
      liked: true
    },

    {
      id: 2,
      price: "£3500",
      title: "Washing Machine",
      description: "White 2K km",
      location: "Palmyra",
      category: t("appliances"),
      images: [machine, mixer],
      liked: true
    },

    {
      id: 3,
      price: "£4000",
      title: "Honda Civic",
      description: "White 2K km",
      location: "Palmyra",
      category: t("cars"),
      images: [verna, audi],
      liked: true
    },

    {
      id: 4,
      price: "£3000",
      title: "Commercial Office",
      description: "White 2K km",
      location: "Palmyra",
      category: t("property"),
      images: [office, building],
      liked: true
    },
    {
      id: 5,
      price: "£4500",
      title: "Kitchen Mixer",
      description: "White 2K km",
      location: "Palmyra",
      category: t("appliances"),
      images: [mixer, machine],
      liked: true
    },

    {
      id: 6,
      price: "£5500",
      title: "Ferrari Enzo",
      description: "White 2K km",
      location: "Palmyra",
      category: t("cars"),
      images: [ferrari, audi],
      liked: true
    },

    {
      id: 7,
      price: "£2500",
      title: "iPhone X",
      description: "White 2K km",
      location: "Palmyra",
      category: t("electronics"),
      images: [iphone, machine],
      liked: true
    },

    {
      id: 8,
      price: "£5500",
      title: "Compound Building",
      description: "White 2K km",
      location: "Palmyra",
      category: t("property"),
      images: [building, office],
      liked: true
    },
  ];
  return (
    <div className="p-5">
      <h1 className="main-heading">{t("wishlist")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
        {cars.map((car) => (
          <ProductCard key={car.id} item={car} />
        ))}
      </div>
    </div>
  );
};
