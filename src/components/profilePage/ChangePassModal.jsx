import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { postRequest } from "../../config/apiFunctions";
import { CUSTOMER } from "../../config/endPoints";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtils";
import { InfoModal } from "../../common/modal/InfoModal";
import LoadingButton from "../../common/loadingButton/LoadingButton";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";

export const ChangePassModal = ({ isOpen, onClose, userInfo }) => {
  const { i18n, t } = useTranslation();

  const schema = Yup.object().shape({
    password: userInfo?.is_password_set
      ? Yup.string().required(t("userPasswordRequired"))
      : Yup.string().notRequired(),
    newPassword: Yup.string().required(t("userNewPasswordRequired")),
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*_|:;"'<>,./])[A-Za-z\d~`!@#$%^&*_|:;"'<>,./]{8,}$/,
    //   t("passwordRegx")
    // ),
    confirmPassword: Yup.string()
      .required(t("confirmPasswordRequired"))
      .when("newPassword", {
        is: (val) => val && val.length > 0,
        then: (schema) =>
          schema.test(
            "passwords-match",
            t("passwordsMustMatch"),
            function (value) {
              return !value || value === this.resolve(Yup.ref("newPassword"));
            }
          ),
      }),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(true);
  const [toggleNew, setToggleNew] = useState(true);
  const [toggleConfirm, setToggleConfirm] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlepass = () => {
    setToggle(!toggle);
  };

  const handlepassNew = () => {
    setToggleNew(!toggleNew);
  };

  const handlepassConfirm = () => {
    setToggleConfirm(!toggleConfirm);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const payload = {
      ...(userInfo?.is_password_set && { currentPassword: data.password }),
      newPassword: data.newPassword,
    };

    try {
      const response = await postRequest(CUSTOMER.UPDATE_PASSWORD, payload);
      if (response?.data?.success && response?.data?.statusCode === 200) {
        dispatch(
          setUser({
            ...userInfo,
            is_password_set: true,
          })
        );
        showSuccessToast(response?.data?.message);
        setShowInfoModal(true);
        reset();
        setLoading(false);
        setToggle(true);
        setToggleNew(true);
        setToggleConfirm(true);
      }
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setLoading(false);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-lg px-5 py-4">
        <div className="flex items-center justify-between border-b border-gray-200 py-4 ">
          <h2 className="text-xl font-bold">
            {userInfo?.is_password_set
              ? t("changePassword")
              : t("createPassword")}
          </h2>
          <button
            onClick={() => {
              onClose();
              reset();
            }}
            className={`${
              i18n.language === "ar" ? "left-6" : "right-6"
            } absolute top-8  text-gray-400 hover:text-gray-600`}
          >
            <i className="fa-solid fa-xmark fa-lg" />
          </button>
        </div>

        <div className="py-4 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {userInfo?.is_password_set && (
              <div>
                <label className="block mb-2 text-base font-bold">
                  {t("password")}
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={toggle === true ? "password" : "text"}
                    id="password"
                    className={`${
                      i18n.language === "ar" ? "pl-12" : "pr-12"
                    } w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
                    autoComplete="off"
                    placeholder={t("enterPassword")}
                  />
                  <i
                    className={`${
                      toggle === true
                        ? "fa-regular fa-eye-slash show-pass"
                        : "fa-regular fa-eye show-pass"
                    } ${
                      i18n?.language === "ar" ? "left-3" : "right-3"
                    } absolute top-4  cursor-pointer text-center`}
                    onClick={handlepass}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password?.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block mb-2 text-base font-bold">
                {t("newPassword")}
              </label>
              <div className="relative">
                <input
                  {...register("newPassword")}
                  type={toggleNew === true ? "password" : "text"}
                  id="newPassword"
                  className={`${
                    i18n.language === "ar" ? "pl-12" : "pr-12"
                  } w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
                  autoComplete="off"
                  placeholder={t("enterNewPass")}
                />
                <i
                  className={`${
                    toggleNew === true
                      ? "fa-regular fa-eye-slash show-pass"
                      : "fa-regular fa-eye show-pass"
                  } ${
                    i18n?.language === "ar" ? "left-3" : "right-3"
                  } absolute top-4  cursor-pointer text-center`}
                  onClick={handlepassNew}
                />
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-base font-bold">
                {t("confirmPassword")}
              </label>
              <div className="relative">
                <input
                  type={toggleConfirm === true ? "password" : "text"}
                  {...register("confirmPassword")}
                  className={`${
                    i18n.language === "ar" ? "pl-12" : "pr-12"
                  } w-full rounded h-[48px] px-4 py-2 bg-gray-100 focus:outline-none`}
                  placeholder={t("enterConfirmPassword")}
                />
                <i
                  className={`${
                    toggleConfirm === true
                      ? "fa-regular fa-eye-slash show-pass"
                      : "fa-regular fa-eye show-pass"
                  } ${
                    i18n?.language === "ar" ? "left-3" : "right-3"
                  } absolute top-4  cursor-pointer text-center`}
                  onClick={handlepassConfirm}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* <button
              type="submit"
              className="w-full h-[56px] mt-3 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryDark transition"
            >
              {t("saveButton")}
            </button> */}
            <LoadingButton
              type="submit"
              loading={loading}
              disabled={loading}
              className="bg-primary text-white text-base hover:bg-primaryDark h-[56px]"
            >
              {t("saveButton")}
            </LoadingButton>
          </form>
        </div>
      </div>

      {showInfoModal && (
        <InfoModal
          onClose={() => {
            setShowInfoModal(false);
            onClose();
          }}
          title={t("passwordChanged")}
          subtitle={t("passwordChangedSuccessfully")}
        />
      )}
    </div>
  );
};
