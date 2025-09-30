import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRequest } from "../../config/apiFunctions";
import { CONTENT } from "../../config/endPoints";
import parse from "html-react-parser";
import { ScreenLoader } from "../../utils/screenLoader";

export const AboutUs = () => {
  const { t } = useTranslation();
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(false);

  const getPageData = async (url) => {
    setLoading(true);
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setPageData(response?.data?.data?.content);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPageData(`${CONTENT.GET}?type=ABOUT_US`);
  }, []);

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
        <div className="spacer-x">
          <div className="pt-14 pb-5 border-b border-gray-200">
            <h1 className="main-heading">{t("aboutSouqSyria")}</h1>
          </div>
          <div className="pt-4 pb-20">
            {pageData?.length > 0 ? (
              pageData?.map((item, i) => (
                <div key={i}>{parse(`${item?.description}`)}</div>
              ))
            ) : (
              <p>{t("noDataFound")}</p>
            )}

            {/* <h3 className="font-bold text-xl pt-4">Lorem ipsum dolor sit amet?</h3>
        <p className="text-gray-700 py-1">
          Lorem ipsum dolor sit amet consectetur. Adipiscing elementum sed sem
          sed. Bibendum donec netus vel aenean nunc sed nulla elementum. Mattis
          viverra risus duis tristique. Posuere ut nascetur sed fermentum diam
          urna sed. Urna ultrices aliquam sagittis sit velit orci volutpat
          mattis nulla. Vestibulum faucibus lectus lacinia luctus non facilisi
          gravida arcu.
        </p>
        <p className="text-gray-700 py-1">
          Lorem ipsum dolor sit amet consectetur. Adipiscing elementum sed sem
          sed. Bibendum donec netus vel aenean nunc sed nulla elementum.{" "}
        </p>
        <p className="text-gray-700 py-1">
          Lorem ipsum dolor sit amet consectetur. Adipiscing elementum sed sem
          sed. Bibendum donec netus vel aenean nunc sed nulla elementum. Mattis
          viverra risus duis tristique. Posuere ut nascetur sed fermentum diam
          urna sed. Urna ultrices aliquam sagittis sit velit orci volutpat
          mattis nulla. Vestibulum faucibus lectus lacinia luctus non facilisi
          gravida arcu.
        </p> */}
          </div>
        </div>
      )}
    </>
  );
};
