import React, { useState } from "react";
import { SearchTopFilter } from "../../components/searchPage/SearchTopFilter";
import ProductFilter from "../../components/searchPage/ProductFilter";

export const ProductPage = () => {
  const categories = [
    "Vehicle For Sale",
    "Vehicle Accessories",
    "Cars",
    "Heavy Machinery",
    "Bikes",
    "Vehicle Spare Part",
    "Buses, Trucks & Trailers",
    "Tires, Wheels & Rims",
    "Motorcycles & Accessories",
    "Junk Cars & Parts",
    "Vehicles For Rent",
  ];

  const [toggleGrid, setToggleGrid] = useState(false);

  return (
    <div className="spacer-x">
      <SearchTopFilter
        categories={categories}
        toggleGrid={toggleGrid}
        setToggleGrid={setToggleGrid}
      />
      <ProductFilter  toggleGrid={toggleGrid}/>
    </div>
  );
};
