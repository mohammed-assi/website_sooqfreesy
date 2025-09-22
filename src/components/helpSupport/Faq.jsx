import React from "react";
import { useTranslation } from "react-i18next";
import parse from "html-react-parser";

export const Faq = ({ pageData }) => {
  const { t } = useTranslation();
  return (
    <div className="pb-15">
      {pageData?.length > 0 ? (
        pageData.map((item, i) => (
          <div key={i} className="py-3">
            <h2 className="text-xl font-bold">
              {i + 1}. {item?.title}
            </h2>
            <p className="text-gray-700">{parse(`${item?.description}`)}</p>
          </div>
        ))
      ) : (
        <p>{t("noDataFound")}</p>
      )}
    </div>
  );
};
