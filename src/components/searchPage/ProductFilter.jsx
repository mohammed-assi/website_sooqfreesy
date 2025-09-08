import React, { useState } from "react";
import audi from "../../assets/image/audi.png";
import verna from "../../assets/image/verna.png";
import ferrari from "../../assets/image/ferrari.png";
import office from "../../assets/image/office.png";
import building from "../../assets/image/building.png";
import iphone from "../../assets/image/iphone.png";
import mixer from "../../assets/image/mixer.png";
import machine from "../../assets/image/machine.png";
import { useTranslation } from "react-i18next";
import { ProductCard } from "../../common/card/ProductCard";
import Pagination from "../../common/pagination";
import ProductListCard from "./ProductListCard";
import { SideFilter } from "./SideFilter";

export default function ProductFilter({ toggleGrid }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

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
    <div className="pt-8 pb-15">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <SideFilter />

        <main className="lg:col-span-3">
          {cars.length === 0 ? (
            <p className="text-gray-500">No results found.</p>
          ) : !toggleGrid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <ProductCard key={car.id} item={car} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {cars.map((car) => (
                <ProductListCard key={car.id} item={car} />
              ))}
            </div>
          )}

          <Pagination
            totalPages={10}
            currentPage={page}
            onPageChange={setPage}
          />
        </main>
      </div>
    </div>
  );
}
