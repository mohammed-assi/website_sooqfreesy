import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import {
  deleteRequest,
  getRequest,
  postRequest,
} from "../../config/apiFunctions";
import { CUSTOMER, POST } from "../../config/endPoints";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ROUTE } from "../../config/constants";
import { City, Country, State } from "country-state-city";
import LoadingButton from "../../common/loadingButton/LoadingButton";
import { EditCityLocation } from "../../components/editPost/EditCityLocation";
import { EditCategory } from "../../components/editPost/EditCategory";
import { EditRentSale } from "../../components/editPost/EditRentSale";
import { EditSubCategory } from "../../components/editPost/EditSubCategory";
import { EditLandlordAgent } from "../../components/editPost/EditLandlordAgent";
import { EditFinalForm } from "../../components/editPost/EditFinalForm";
import { ScreenLoader } from "../../utils/screenLoader";

export const EditPost = () => {
  const { t } = useTranslation();
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
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
  const [loading, setLoading] = useState(false);
  const [userCountry, setUserCountry] = useState(null);
  const [postDetailData, setPostDetailData] = useState({});

  const baseSchema = {
    country: Yup.string().required(t("countryRequired")),
    // state: Yup.string().required(t("stateRequired")),
    // city: Yup.string().required(t("cityRequired")),
    state: Yup.string(),
    city: Yup.string(),
    location: Yup.string().required(t("locationRequired")),
    buildingNumber: Yup.string(),
    apartmentNumber: Yup.string(),
    pictures: Yup.array()
      .of(
        Yup.mixed().test("fileType", t("onlyImageAllowed"), (value) => {
          if (!value) return false;
          if (value?.id && value?.preview) return true;
          if (
            value?.file instanceof File &&
            value.file.type.startsWith("image/")
          ) {
            return true;
          }
          return false;
        })
      )
      .min(1, t("oneImage"))
      .max(10, t("fiveImages")),
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
    const userType =
      landlordAgentId === 1
        ? categoryData?.name === "Real Estate"
          ? "LANDLORD"
          : "OWNER"
        : "AGENT";
    const postType = saleRentId === 1 ? "SALE" : "RENT";
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("price_syp", data.price_syp);
    formData.append("country_code", data.country_code || "+963");
    formData.append("phone", data.phone || "9876543210");
    // formData.append("city", selectedCity.label || "Mohali");
    // formData.append("country", coords?.country || "Syria");
    formData.append("city", data.city || "");
    formData.append("state", data.state || "");
    formData.append("country", data.country);

    // formData.append("currency", data.currency);

    formData.append("nearby_location", data.location);
    formData.append("longitude", coords?.lng || postDetailData?.longitude);
    formData.append("latitude", coords?.lat || postDetailData?.latitude);
    formData.append("building_street_name", data.buildingNumber || "");
    formData.append("apartment_villa_no", data.apartmentNumber || "");
    formData.append(
      "category_id",
      categoryData?.id || postDetailData?.category_id
    );
    formData.append(
      "sub_category_id",
      subCategoryId || postDetailData?.sub_category_id
    );
    formData.append("post_type", postType || postDetailData?.post_type);
    formData.append("user_type", userType || postDetailData?.user_type);

    data.pictures.forEach((pic) => {
      formData.append("images", pic.file);
    });

    const {
      title,
      description,
      price,
      price_syp,
      country_code,
      phone,
      city,
      state,
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
      // currency,
      ...rest
    } = data;

    formData.append("content", JSON.stringify(rest));
    try {
      const response = await postRequest(`${POST.UPDATE}/${id}`, formData);

      if (response?.data?.success && response?.data?.statusCode === 200) {
        showSuccessToast(response?.data?.message);
        navigate(ROUTE.MY_ADS);
        reset();
        setLoading(false);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
  };

  const handleDeleteImg = async (imgId) => {
    try {
      const res = await deleteRequest(
        `${POST.DELETE_IMG}?listing_id=${postDetailData?.id}&listing_image_id=${imgId}`
      );

      if (res?.data?.statusCode === 200) {
        showSuccessToast(res?.data?.message);
        getPostDeatilsCallBack();
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

  const getCountryCodeByName = (name) => {
    const country = countries.find((c) => c.name === name);
    return country?.isoCode || "";
  };

  const getPostDeatils = async (url) => {
    setLoading(true);
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setPostDetailData(response?.data?.data?.post);
      setLoading(false);
    }
    setLoading(false);
  };

  const getPostDeatilsCallBack = () => {
    getPostDeatils(`${POST.GET_DETAILS}/${id}`);
  };

  useEffect(() => {
    getCategoryList(`${CUSTOMER.CATEGORY_LIST}`);
  }, []);

  useEffect(() => {
    if (categoryData) {
      getSubCategory(
        `${CUSTOMER.GET_SUBCATEGORY}/${categoryData.id}?onlyWithForms=true`
      );
    }
  }, [categoryData]);

  useEffect(() => {
    if (categoryData && subCategoryId) {
      getFormData(
        `${CUSTOMER.GET_FORM_DATA}?category_id=${categoryData.id}&sub_category_id=${subCategoryId}`
      );
    }
  }, [categoryData, subCategoryId, t]);

  useEffect(() => {
    reset();
  }, [t]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

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
      if (!postDetailData?.city) {
        setValue("city", "");
      }
    }
  }, [selectedState, selectedCountry, setValue, states]);

  useEffect(() => {
    getPostDeatilsCallBack();
  }, []);

  useEffect(() => {
    if (location?.state) {
      setShowFinalForm(true);
    }
  }, [location]);

  useEffect(() => {
    if (postDetailData?.category_id && postDetailData?.sub_category_id) {
      getFormData(
        `${CUSTOMER.GET_FORM_DATA}?category_id=${postDetailData?.category_id}&sub_category_id=${postDetailData?.sub_category_id}`
      );
      getSubCategory(
        `${CUSTOMER.GET_SUBCATEGORY}/${postDetailData?.category_id}?onlyWithForms=true`
      );
    }
  }, [postDetailData]);

  useEffect(() => {
    if (postDetailData && Object.keys(postDetailData).length > 0) {
      const initialValues = {
        country: postDetailData.country || "",
        state: postDetailData.state || "",
        city: postDetailData.city || "",
        location: postDetailData.nearby_location || "",
        buildingNumber: postDetailData.building_street_name || "",
        apartmentNumber: postDetailData.apartment_villa_no || "",
        title: postDetailData.title || "",
        description: postDetailData.description || "",
        price: postDetailData.price || "",
        price_syp: postDetailData.price_syp || "",
        // currency: postDetailData.currency || "",
        phone: postDetailData.phone || "",
        country_code: postDetailData.country_code || "+963",
        ...postDetailData.content,
        pictures:
          postDetailData.images?.map((img) => ({
            file: null,
            preview: `${imagePath}/${img.image_url}`,
            id: img.id,
          })) || [],
      };

      reset(initialValues);
      const userType = postDetailData?.user_type === "OWNER" ? 1 : 2;
      const postType = postDetailData?.post_type === "SALE" ? 1 : 2;
      setLandlordAgentId(userType);
      setSaleRentId(postType);
      if (postDetailData?.country) {
        const matchedCountry = countries.find(
          (c) => c.name.toLowerCase() === postDetailData.country.toLowerCase()
        );
        if (matchedCountry) {
          setUserCountry(matchedCountry.isoCode);
        }
      }
    }
  }, [postDetailData, reset]);

  console.log("postDetailData---->", postDetailData);

  return (
    <>
      {loading ? (
        <ScreenLoader />
      ) : (
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
                  ? categoryData?.name
                  : ""}
                {showSubCategory &&
                  !showSaleRent &&
                  !showLandlordAgent &&
                  !showFinalForm &&
                  t("chooseSubcat")}
                {showLandlordAgent && !showFinalForm && t("landlordoragent")}
                {showFinalForm && t("almostthere")}
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
                  {/* <button
                type="submit"
                form="adForm"
                className="flex gap-2 items-center py-4 px-6 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
              >
                {t("postAd")}
              </button>  */}
                  <LoadingButton
                    type="submit"
                    form="adForm"
                    loading={loading}
                    disabled={loading}
                    className="bg-primary py-4 px-6 text-white text-base hover:bg-primaryDark h-[56px]"
                  >
                    {t("postAd")}
                  </LoadingButton>
                </div>
              )}
            </div>

            {!showChooseCategory &&
              !showSubCategory &&
              !showSaleRent &&
              !showLandlordAgent &&
              !showFinalForm && (
                <EditCityLocation
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
                  watch={watch}
                  setUserCountry={setUserCountry}
                  userCountry={userCountry}
                />
              )}

            {showChooseCategory &&
              !showSubCategory &&
              !showSaleRent &&
              !showLandlordAgent &&
              !showFinalForm && (
                <EditCategory
                  categoryList={categoryList}
                  handleChooseCategory={handleChooseCategory}
                  imagePath={imagePath}
                  postDetailData={postDetailData}
                />
              )}

            {showSaleRent && !showLandlordAgent && !showFinalForm && (
              <EditRentSale
                categoryData={categoryData}
                imagePath={imagePath}
                handleChooseRentSale={handleChooseRentSale}
                postDetailData={postDetailData}
              />
            )}

            {showSubCategory &&
              !showSaleRent &&
              !showLandlordAgent &&
              !showFinalForm && (
                <EditSubCategory
                  subCategoryList={subCategoryList}
                  imagePath={imagePath}
                  handleChooseSubCategory={handleChooseSubCategory}
                  postDetailData={postDetailData}
                />
              )}

            {showLandlordAgent && !showFinalForm && (
              <EditLandlordAgent
                handleChooseLandlordAgent={handleChooseLandlordAgent}
                categoryData={categoryData}
                postDetailData={postDetailData}
              />
            )}

            {showFinalForm && (
              <EditFinalForm
                formData={formData}
                register={register}
                errors={errors}
                onSubmit={onSubmit}
                handleSubmit={handleSubmit}
                pictures={pictures}
                setValue={setValue}
                control={control}
                handleDeleteImg={handleDeleteImg}
                setCoords={setCoords}
                setUserLocation={setUserLocation}
                setShowLocationValidation={setShowLocationValidation}
                trigger={trigger}
                userCountry={userCountry}
                setSelectedCity={setSelectedCity}
                showLocationValidation={showLocationValidation}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
