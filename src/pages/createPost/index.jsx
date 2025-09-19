import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectCityLocation } from "../../components/createPost/SelectCityLocation";
import { ChooseCategory } from "../../components/createPost/ChooseCategory";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { getRequest, postRequest } from "../../config/apiFunctions";
import { CUSTOMER, POST } from "../../config/endPoints";
import { ChooseSubCategory } from "../../components/createPost/ChooseSubCategory";
import { ChooseRentSale } from "../../components/createPost/ChooseRentSale";
import { ChoodeLandlordAgent } from "../../components/createPost/ChoodeLandlordAgent";
import { FinalForm } from "../../components/createPost/FinalForm";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../config/constants";
import { City, Country, State } from "country-state-city";

export const CreatePost = () => {
  const { i18n, t } = useTranslation();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const navigate = useNavigate();
  const [showChooseCategory, setShowChooseCategory] = useState(false);
  const [showSaleRent, setShowSaleRent] = useState(false);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [showLandlordAgent, setShowLandlordAgent] = useState(false);
  const [showFinalForm, setShowFinalForm] = useState(false);
  const [categoryData, setCategoryData] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [saleRentId, setSaleRentId] = useState(null);
  const [landlordAgentId, setLandlordAgentId] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [formData, setFormData] = useState({});
  const [userLocation, setUserLocation] = useState("");
  const [showLocationValidation, setShowLocationValidation] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lng: null, country: null });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const baseSchema = {
    country: Yup.string().required(t("countryRequired")),
    state: Yup.string().required(t("stateRequired")),
    city: Yup.string().required(t("cityRequired")),
    location: Yup.string().required(t("locationRequired")),
    buildingNumber: Yup.string(),
    apartmentNumber: Yup.string(),
    pictures: Yup.array()
      .of(
        Yup.mixed().test("fileType", t("onlyImageAllowed"), (value) => {
          if (!value) return false;
          return (
            value.file instanceof File && value.file.type.startsWith("image/")
          );
        })
      )
      .min(1, t("oneImage"))
      .max(5, t("fiveImages")),
  };

  const step1Schema = Yup.object().shape({
    country: Yup.string().required(t("countryRequired")),
    state: Yup.string().required(t("stateRequired")),
    city: Yup.string().required(t("cityRequired")),
    location: Yup.string().required(t("locationRequired")),
    buildingNumber: Yup.string(), // optional
    apartmentNumber: Yup.string(), // optional
  });

  const schemaShape = { ...baseSchema };

  formData?.form_data?.forEach((field) => {
    let validator;

    // Text & Textarea
    if (field.type === "text" || field.type === "textarea") {
      validator = Yup.string();
      if (field.required) {
        validator = validator.required(`${field.label} ${t("isRequired")}`);
      } else {
        validator = validator.nullable();
      }
    }

    // Number
    if (field.type === "number") {
      validator = Yup.number().typeError(
        `${field.label} ${t("mustNumberValidation")}`
      );
      if (field.required) {
        validator = validator.required(`${field.label} ${t("isRequired")}`);
      } else {
        validator = validator.notRequired();
      }
    }

    // Checkbox (array of strings)
    if (field.type === "checkbox") {
      validator = Yup.array()
        .transform((value, originalValue) => {
          if (originalValue === false || originalValue === undefined) {
            return [];
          }
          return value;
        })
        .of(Yup.string());

      if (field.required) {
        validator = validator.min(1, `${field.label} ${t("isRequired")}`);
      } else {
        validator = validator.notRequired();
      }
    }

    // Radio (single string value)
    if (field.type === "radio") {
      validator = Yup.string();
      if (field.required) {
        validator = validator.required(`${field.label} ${t("isRequired")}`);
      } else {
        validator = validator.notRequired();
      }
    }

    // Dropdown / Select (single string value)
    if (field.type === "dropdown") {
      validator = Yup.string();
      if (field.required) {
        validator = validator.required(`${field.label} ${t("isRequired")}`);
      } else {
        validator = validator.notRequired();
      }
    }

    // Date (react-datepicker -> JS Date object)
    if (field.type === "date") {
      validator = Yup.date().typeError(`${field.label} ${t("mustValidDate")}`);
      if (field.required) {
        validator = validator.required(`${field.label} ${t("isRequired")}`);
      } else {
        validator = validator.nullable();
      }
    }

    schemaShape[field.name] = validator;
  });

  const schema = Yup.object().shape(schemaShape);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      pictures: [],
    },
  });

  const selectedCountry = watch("country");
  const selectedState = watch("state");
  const pictures = watch("pictures") || [];

  const handleNext = async () => {
    const step1Fields = [
      "country",
      "state",
      "city",
      "location",
      "buildingNumber",
      "apartmentNumber",
    ];

    const isValid = await trigger(step1Fields);

    if (isValid) {
      setShowChooseCategory(true);
    } else {
      console.log("Step 1 validation failed");
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("country_code", data.country_code || "+963");
    formData.append("phone", data.phone || "9876543210");
    // formData.append("city", selectedCity.label || "Mohali");
    // formData.append("country", coords?.country || "Syria");
    formData.append("city", data.city || "Mohali");
    formData.append("country", data.country || "Syria");

    formData.append("nearby_location", data.location);
    formData.append("longitude", coords?.lng || 34.8021);
    formData.append("latitude", coords?.lat || 38.9968);
    formData.append("building_street_name", data.buildingNumber);
    formData.append("apartment_villa_no", data.apartmentNumber);
    formData.append("category_id", categoryData?.id);
    formData.append("sub_category_id", subCategoryId);
    formData.append("post_type", saleRentId === 1 ? "SALE" : "RENT");
    formData.append("user_type", landlordAgentId === 1 ? "OWNER" : "AGENT");

    data.pictures.forEach((pic) => {
      formData.append("images", pic.file);
    });

    const {
      title,
      description,
      price,
      country_code,
      phone,
      city,
      country,
      location,
      longitude,
      latitude,
      buildingNumber,
      apartmentNumber,
      category_id,
      sub_category_id,
      post_type,
      user_type,
      pictures,
      ...rest
    } = data;

    formData.append("content", JSON.stringify(rest));
    try {
      const response = await postRequest(POST.CREATE, formData);

      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        navigate(ROUTE.ROOT);
        reset();
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const handleChooseCategory = (data) => {
    setCategoryData(data);
    setShowChooseCategory(false);
    if (
      data.name === "Others" ||
      data.name === "Other" ||
      data.name === "others" ||
      data.name === "other"
    ) {
      setShowSubCategory(true);
    } else {
      setShowSaleRent(true);
    }
  };

  const handleChooseRentSale = (id) => {
    setSaleRentId(id);
    setShowSaleRent(false);
    setShowSubCategory(true);
  };

  const handleChooseSubCategory = (id) => {
    setSubCategoryId(id);
    setShowSubCategory(false);
    setShowLandlordAgent(true);
  };

  const handleChooseLandlordAgent = (id) => {
    setLandlordAgentId(id);
    setShowLandlordAgent(false);
    setShowFinalForm(true);
  };

  const getCategoryList = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setCategoryList(response?.data?.data?.categories);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const getSubCategory = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setSubCategoryList(response?.data?.data);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  const getFormData = async (url) => {
    try {
      const response = await getRequest(url);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        setFormData(response?.data?.data);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getCategoryList(`${CUSTOMER.CATEGORY_LIST}`);
  }, []);

  useEffect(() => {
    if (categoryData) {
      getSubCategory(`${CUSTOMER.GET_SUBCATEGORY}/${categoryData.id}`);
    }
  }, [categoryData]);

  useEffect(() => {
    if (categoryData && subCategoryId) {
      getFormData(
        `${CUSTOMER.GET_FORM_DATA}?category_id=${categoryData.id}&sub_category_id=${subCategoryId}`
      );
    }
  }, [categoryData, subCategoryId]);

  useEffect(() => {
    reset();
  }, [t]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  const getCountryCodeByName = (name) => {
    const country = countries.find((c) => c.name === name);
    return country?.isoCode || "";
  };

  useEffect(() => {
    if (selectedCountry) {
      const countryCode = getCountryCodeByName(selectedCountry);
      const countryStates = State.getStatesOfCountry(countryCode);
      setStates(countryStates);
      setValue("state", "");
      setCities([]);
      setValue("city", "");
    }
  }, [selectedCountry, setValue]);

  useEffect(() => {
    if (selectedState && selectedCountry) {
      const countryCode = getCountryCodeByName(selectedCountry);
      const stateObj = states.find((s) => s.name === selectedState);
      const stateCode = stateObj?.isoCode || "";
      const stateCities = City.getCitiesOfState(countryCode, stateCode);
      setCities(stateCities);
      setValue("city", "");
    }
  }, [selectedState, selectedCountry, setValue, states]);

  return (
    <div className="spacer-x">
      <div className="pt-15 pb-10">
        <div className="text-sm text-gray-500 mb-2">
          {t("home")} <span className="mx-1">{">"}</span> {t("postYourAd")}
        </div>

        <div className="flex justify-between items-center">
          <h1 className="main-heading">
            {!showChooseCategory &&
              !showSaleRent &&
              !showSubCategory &&
              !showLandlordAgent &&
              !showFinalForm &&
              t("postYourAd")}
            {showChooseCategory &&
              !showSaleRent &&
              !showLandlordAgent &&
              !showFinalForm &&
              t("chooseCategory")}
            {showSaleRent && !showLandlordAgent && !showFinalForm
              ? i18n.language === "ar"
                ? categoryData?.arabic_name
                : categoryData?.name
              : ""}
            {showLandlordAgent &&
              !showFinalForm &&
              "Are you a landlord or an agent?"}
            {showFinalForm && "You are almost there"}
          </h1>
          {!showChooseCategory &&
            !showSubCategory &&
            !showSaleRent &&
            !showLandlordAgent &&
            !showFinalForm && (
              <button
                type="button"
                onClick={handleNext}
                className="flex gap-2 items-center py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
              >
                {t("nextButton")} <i className="fa-solid fa-arrow-right" />
              </button>
            )}
          {showChooseCategory &&
            !showSubCategory &&
            !showSaleRent &&
            !showLandlordAgent &&
            !showFinalForm && (
              <button
                onClick={() => setShowChooseCategory(false)}
                className="flex gap-2 items-center py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
              >
                <i className="fa-solid fa-arrow-left" /> {t("backButton")}
              </button>
            )}
          {showSaleRent && !showLandlordAgent && !showFinalForm && (
            <button
              onClick={() => {
                setShowSaleRent(false);
                setShowChooseCategory(true);
                setCategoryData(null);
              }}
              className="flex gap-2 items-center py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
            >
              <i className="fa-solid fa-arrow-left" /> {t("backButton")}
            </button>
          )}
          {showSubCategory &&
            !showSaleRent &&
            !showLandlordAgent &&
            !showFinalForm && (
              <button
                onClick={() => {
                  setShowSubCategory(false);
                  setShowChooseCategory(true);
                  setCategoryData(null);
                }}
                className="flex gap-2 items-center py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
              >
                <i className="fa-solid fa-arrow-left" /> {t("backButton")}
              </button>
            )}
          {showLandlordAgent && !showFinalForm && (
            <button
              onClick={() => {
                setShowLandlordAgent(false);
                setShowSubCategory(true);
                setSubCategoryId(null);
              }}
              className="flex gap-2 items-center py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
            >
              <i className="fa-solid fa-arrow-left" /> {t("backButton")}
            </button>
          )}

          {showFinalForm && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowFinalForm(false);
                  setShowLandlordAgent(true);
                }}
                className="flex gap-2 items-center py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
              >
                <i className="fa-solid fa-arrow-left" /> {t("backButton")}
              </button>
              <button
                type="submit"
                form="adForm"
                className="flex gap-2 items-center py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
              >
                {t("postAd")}
              </button>
            </div>
          )}
        </div>

        {!showChooseCategory &&
          !showSubCategory &&
          !showSaleRent &&
          !showLandlordAgent &&
          !showFinalForm && (
            <SelectCityLocation
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              register={register}
              errors={errors}
              onSubmit={onSubmit}
              handleSubmit={handleSubmit}
              setUserLocation={setUserLocation}
              showLocationValidation={showLocationValidation}
              setShowLocationValidation={setShowLocationValidation}
              control={control}
              setCoords={setCoords}
              coords={coords}
              countries={countries}
              states={states}
              cities={cities}
              selectedState={selectedState}
              selectedCountry={selectedCountry}
              setValue={setValue}
              trigger={trigger}
            />
          )}

        {showChooseCategory &&
          !showSubCategory &&
          !showSaleRent &&
          !showLandlordAgent &&
          !showFinalForm && (
            <ChooseCategory
              categoryList={categoryList}
              handleChooseCategory={handleChooseCategory}
              imagePath={imagePath}
            />
          )}

        {showSaleRent && !showLandlordAgent && !showFinalForm && (
          <ChooseRentSale
            categoryData={categoryData}
            imagePath={imagePath}
            handleChooseRentSale={handleChooseRentSale}
          />
        )}

        {showSubCategory &&
          !showSaleRent &&
          !showLandlordAgent &&
          !showFinalForm && (
            <ChooseSubCategory
              subCategoryList={subCategoryList}
              imagePath={imagePath}
              handleChooseSubCategory={handleChooseSubCategory}
            />
          )}

        {showLandlordAgent && !showFinalForm && (
          <ChoodeLandlordAgent
            handleChooseLandlordAgent={handleChooseLandlordAgent}
          />
        )}

        {showFinalForm && (
          <FinalForm
            formData={formData}
            register={register}
            errors={errors}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            pictures={pictures}
            setValue={setValue}
            control={control}
          />
        )}
      </div>
    </div>
  );
};
