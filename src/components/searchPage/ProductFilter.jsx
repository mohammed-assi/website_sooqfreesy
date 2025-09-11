import { ProductCard } from "../../common/card/ProductCard";
import Pagination from "../../common/pagination";
import ProductListCard from "./ProductListCard";
import { SideFilter } from "./SideFilter";

export default function ProductFilter({
  toggleGrid,
  allPosts,
  imagePath,
  currentPage,
  setCurrentPage,
  totalPages,
  allCategory,
  handleChange,
  filters
}) {

  return (
    <div className="pt-8 pb-15">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <SideFilter allCategory={allCategory} handleChange={handleChange} filters={filters} />

        <main className="lg:col-span-3">
          {allPosts?.length === 0 ? (
            <p className="text-gray-500">No results found.</p>
          ) : !toggleGrid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts?.map((item) => (
                <ProductCard key={item.id} item={item} imagePath={imagePath} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {allPosts?.map((item) => (
                <ProductListCard
                  key={item.id}
                  item={item}
                  imagePath={imagePath}
                />
              ))}
            </div>
          )}

          {allPosts?.length > 0 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
