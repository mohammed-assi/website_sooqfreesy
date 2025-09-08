import React, { useState } from "react";

export const SideFilter = () => {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 25000]);
  return (
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
        <label className="block text-sm font-medium mb-1">Vehicle Type</label>
        <div className="flex gap-3">
          <button
            onClick={() => setType("sale")}
            className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
              type === "sale" ? "bg-primary text-white" : "hover:bg-gray-100"
            }`}
          >
            Vehicle for Sale
          </button>
          <button
            onClick={() => setType("rent")}
            className={`flex-1 px-3 py-2 border rounded-lg text-sm ${
              type === "rent" ? "bg-primary text-white" : "hover:bg-gray-100"
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
        <label className="block text-sm font-medium mb-1">Price Range</label>
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
  );
};
