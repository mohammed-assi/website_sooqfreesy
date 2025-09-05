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

export default function ProductFilter({ toggleGrid }) {
  const { t } = useTranslation();
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 25000]);
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

  return (
    <div className="pt-8 pb-15">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="bg-white shadow rounded-lg p-5 space-y-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select City</option>
              <option value="Damascus">Damascus</option>
              <option value="Aleppo">Aleppo</option>
              <option value="Homs">Homs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nearby Location
            </label>
            <input
              type="text"
              placeholder="Enter Area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Vehicle Type
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setType("sale")}
                className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                  type === "sale"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Vehicle for Sale
              </button>
              <button
                onClick={() => setType("rent")}
                className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
                  type === "rent"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Vehicle for Rent
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Vehicle Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Vehicle</option>
              <option value="Car">Car</option>
              <option value="Truck">Truck</option>
              <option value="Bike">Bike</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Price Range
            </label>
            <input
              type="range"
              min="0"
              max="25000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="25000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>£{priceRange[0]}</span>
              <span>£{priceRange[1]}</span>
            </div>
          </div>
        </aside>

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
