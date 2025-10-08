import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Faq } from "../../components/helpSupport/Faq";
import { ContactUs } from "../../components/helpSupport/ContactUs";
import { CONTENT } from "../../config/endPoints";
import { getRequest } from "../../config/apiFunctions";
import { ScreenLoader } from "../../utils/screenLoader";

export const HelpSupport = () => {
  const { t } = useTranslation();
  const localtion = useLocation();
  const [activeTab, setActiveTab] = useState("contact");
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "contact", label: t("contactUs") },
    { id: "faq", label: t("FAQs") },
  ];

  const faqs = [
    {
      question: "Lorem ipsum dolor sit amet?",
      Answer:
        "Venenatis magnis risus id arcu malesuada tempor. Dictum in ut ornare eu amet. Enim amet lobortis pulvinar dis. Sem pulvinar ut diam nunc eu et mauris. Nunc arcu dui a nulla tellus euismod vitae. Tempus viverra proin eget mus dignissim imperdiet vitae. Venenatis magnis risus id arcu malesuada tempor.",
    },
    {
      question: "Lorem ipsum dolor sit amet?",
      Answer:
        "Venenatis magnis risus id arcu malesuada tempor. Dictum in ut ornare eu amet. Enim amet lobortis pulvinar dis.",
    },
    {
      question: "Lorem ipsum dolor sit amet?",
      Answer:
        "Venenatis magnis risus id arcu malesuada tempor. Dictum in ut ornare eu amet. Enim amet lobortis pulvinar dis. Sem pulvinar ut diam nunc eu et mauris. Nunc arcu dui a nulla tellus euismod vitae. Tempus viverra proin eget mus dignissim imperdiet vitae. Venenatis magnis risus id arcu malesuada tempor.",
    },
    {
      question: "Lorem ipsum dolor sit amet?",
      Answer: "Venenatis magnis risus id arcu malesuada tempor. ",
    },
    {
      question: "Lorem ipsum dolor sit amet?",
      Answer:
        "Venenatis magnis risus id arcu malesuada tempor. Dictum in ut ornare eu amet. Enim amet lobortis pulvinar dis. ",
    },
    {
      question: "Lorem ipsum dolor sit amet?",
      Answer:
        "Venenatis magnis risus id arcu malesuada tempor. Dictum in ut ornare eu amet. Enim amet lobortis pulvinar dis. Sem pulvinar ut diam nunc eu et mauris.",
    },
    {
      question: "Lorem ipsum dolor sit amet?",
      Answer:
        "Venenatis magnis risus id arcu malesuada tempor. Dictum in ut ornare eu amet. Enim amet lobortis pulvinar dis. Sem pulvinar ut diam nunc eu et mauris. Nunc arcu dui a nulla tellus euismod vitae. Tempus viverra proin eget mus dignissim imperdiet vitae. Venenatis magnis risus id arcu malesuada tempor.",
    },
    {
      question: "Lorem ipsum dolor sit amet?",
      Answer:
        "Venenatis magnis risus id arcu malesuada tempor. Dictum in ut ornare eu amet. Enim amet lobortis pulvinar dis. Sem pulvinar ut diam nunc eu et mauris. Nunc arcu dui a nulla tellus euismod vitae. Tempus viverra proin eget mus dignissim imperdiet vitae.",
    },
    {
      question: "Lorem ipsum dolor sit amet?",
      Answer: "Venenatis magnis risus id arcu malesuada tempor.",
    },
  ];

  const [pageData, setPageData] = useState({});

  const getPageData = async (url) => {
    setLoading(true);
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setPageData(response?.data?.data?.content);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPageData(`${CONTENT.GET}?type=FAQ`);
  }, []);

  useEffect(() => {
    if (localtion?.state?.from) {
      setActiveTab(localtion.state.from);
    }
  }, [localtion]);

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
        <div className="spacer-x">
          <div className="pt-10 md:pt-15">
            <h1 className="main-heading">{t("helpAndSupport")}</h1>

            <div className="flex py-8">
              {tabs.map((tab) => (
                <p
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative cursor-pointer pb-2 w-[180px] text-center px-10 text-lg font-semibold  transition-colors ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute left-0 -bottom-[1px] h-[1px] w-full rounded-full transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary h-[2px]"
                        : "bg-gray-300"
                    }`}
                  />
                </p>
              ))}
            </div>

            {activeTab === "contact" && <ContactUs />}
            {activeTab === "faq" && <Faq faqs={faqs} pageData={pageData} />}
          </div>
        </div>
      )}
    </>
  );
};
