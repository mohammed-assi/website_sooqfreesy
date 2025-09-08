import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PhoneInput from "react-phone-input-2";
import { useTranslation } from "react-i18next";

export const ContactUs = () => {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    fullName: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup
      .string()
      .required("Phone number is required"),
    description: yup.string().required("Description is required"),
    platform: yup.string().required("Platform is required"),
    help: yup.string().required("This field is required"),
  });
  
  const [countryCode, setCountryCode] = useState(963);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("data", data);
    console.log("countryCode", countryCode);
    console.log("phoneNumber", phoneNumber);
  };

  return (
    <div className="pb-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-[60%]">
        <div className="">
          <label className="block mb-2 text-md font-bold">
            What do you need help with?
          </label>
          <select
            {...register("help")}
            className="w-full rounded p-3 bg-gray-100 focus:outline-none"
          >
            <option value="Report a User or Listing">Report a User or Listing</option>
            <option value="My Listing">My Listing</option>
            <option value="Browse & Search issues">Browse & Search issues</option>
            <option value="Login & Registration">Login & Registration</option>
            <option value="Legal Matters">Legal Matters</option>
            <option value="Suggestions & Improvements">Suggestions & Improvements</option>
          </select>
          {errors.help && (
            <p className="text-red-500 text-sm mt-1">{errors.help.message}</p>
          )}
        </div>

        <div className="">
          <label className="block mb-2 text-md font-bold">OS Platform</label>
          <select
            {...register("platform")}
            className="w-full rounded p-3 bg-gray-100 focus:outline-none"
          >
            <option value="iOS">iOS</option>
            <option value="Android">Android</option>
            <option value="Desktop/PC">Desktop/PC</option>
            <option value="Mobile Web">Mobile Web</option>
          </select>
          {errors.platform && (
            <p className="text-red-500 text-sm mt-1">
              {errors.platform.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-md font-bold">
            {t("Description")}
          </label>
          <textarea
            type="text"
            {...register("description")}
            rows={4}
            className="w-full rounded p-3 bg-gray-100 focus:outline-none"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-md font-bold">
            {t("Name")}
          </label>
          <input
            type="text"
            {...register("fullName")}
            className="w-full rounded p-3 bg-gray-100 focus:outline-none"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-md font-bold">
            {t("countryCode")} & {t("phone")}
          </label>
          <PhoneInput
            country={"sy"}
            enableSearch={true}
            inputClass="!w-full !h-13 !bg-gray-100 !border-none !rounded !pl-12"
            buttonClass="!bg-gray-100 !border-none !rounded-l"
            dropdownClass="custom-dropdown"
            onChange={(value, country) => {
              const countryCode = country?.dialCode;
              const phoneNumber = value.replace(countryCode, "");

              setCountryCode(countryCode);
              setPhoneNumber(phoneNumber);
              setValue("phone", phoneNumber);
            }}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-md font-bold">
            {t("email")}
          </label>
          <input
            type="text"
            {...register("email")}
            className="w-full rounded p-3 bg-gray-100 focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
        >
          {t("Submit")}
        </button>
      </form>
    </div>
  );
};
