import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const FilterModal = ({
  isOpen,
  onClose,
  onApply,
  handleApplyFilters,
  initialFilters,
}) => {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState(initialFilters?.sorting || "newest");
  const [price, setPrice] = useState(initialFilters?.price || "highest");

  useEffect(() => {
    if (isOpen) {
      setSorting(initialFilters?.sorting || "newest");
      setPrice(initialFilters?.price || "highest");
    }
  }, [isOpen, initialFilters]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6 z-10">
        <div>
          <h2 className="text-lg font-bold mb-4">{t("sorting")}</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sorting"
                value="newest"
                checked={sorting === "newest"}
                onChange={(e) => setSorting(e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <span>{t("newest")}</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="sorting"
                value="relevant"
                checked={sorting === "relevant"}
                onChange={(e) => setSorting(e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <span>{t("relevant")}</span>
            </label>
          </div>
        </div>

        <hr className="my-5 border-gray-300" />

        <div>
          <h2 className="text-lg font-bold mb-4">{t("byPrice")}</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                value="highest"
                checked={price === "highest"}
                onChange={(e) => setPrice(e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <span>{t("highestFirst")}</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                value="lowest"
                checked={price === "lowest"}
                onChange={(e) => setPrice(e.target.value)}
                className="text-primary focus:ring-primary"
              />
              <span>{t("lowestFirst")}</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            className="px-5 py-2 font-semibold bg-primary text-white rounded-lg hover:bg-primaryDark transition w-full"
            onClick={() => {
              const values = { sorting, price };
              onApply(values);
              handleApplyFilters(values);
            }}
          >
            {t("applyButton")}
          </button>
          <button
            className="px-5 py-2 border-2 font-semibold border-primary rounded-lg text-primary hover:bg-primary hover:text-white transition w-full"
            onClick={onClose}
          >
            {t("cancelButton")}
          </button>
        </div>
      </div>
    </div>
  );
};
