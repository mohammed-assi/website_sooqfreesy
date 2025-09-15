export const BASEURL = import.meta.env.VITE_APP_API_URL;
const AUTH_PREFIX = "/auth/customer";
const PREFIX = "/auth";

export const AUTH = {
  LOGIN_USERNAME: `${BASEURL}${AUTH_PREFIX}/login`,
  LOGIN_PHONE: `${BASEURL}${AUTH_PREFIX}/login-phone`,
  LOGIN_PHONE_VERIFY: `${BASEURL}${AUTH_PREFIX}/login-phone-verify`,
  SIGNUP_USERNAME: `${BASEURL}${AUTH_PREFIX}/register`,
  SIGNUP_USERNAME_VERIFY: `${BASEURL}${AUTH_PREFIX}/otp-verify`,
  SIGNUP_PHONE: `${BASEURL}${AUTH_PREFIX}/register-phone`,
  SIGNUP_PHONE_VERIFY: `${BASEURL}${AUTH_PREFIX}/register-phone-verify`,
  CHECK_USERNAME: `${BASEURL}${AUTH_PREFIX}/check-username`,
  GET_PROFILE: `${BASEURL}${AUTH_PREFIX}/profile`,
  FORGOT_PASSWORD: `${BASEURL}${PREFIX}/forgot-password`,
  RESET_PASSWORD: `${BASEURL}${PREFIX}/reset-password`,
  RESEND_OTP: `${BASEURL}${PREFIX}/resend-otp`,
};

export const CUSTOMER = {
  CONTACT_US: `${BASEURL}/customer/contact-issue/create`,
  UPDATE_PROFILE_PIC: `${BASEURL}/customer/update-profile-picture`,
  UPDATE_PASSWORD: `${BASEURL}/customer/change-password`,
  UPDATE_PROFILE_INFO: `${BASEURL}/customer/update-custom-profile`,
  SEND_OTP: `${BASEURL}/customer/send-verification-otp`,
  VERIFY_OTP: `${BASEURL}/customer/verify-customer-otp`,
  CATEGORY_LIST: `${BASEURL}/customer/category/get-all`,
  GET_SUBCATEGORY: `${BASEURL}/customer/subcategory/get-by-category`,
  GET_FORM_DATA: `${BASEURL}/customer/forms/get-by-cat-and-subcat`,
  GET_ALL_SUBCATEGORY: `${BASEURL}/customer/subcategory/get-all`,

  GET_NOTIFICATION_SETTNGS: `${BASEURL}/customer/notification-setting/get-all`,
  UPDATE_SETTING: `${BASEURL}/customer/notification-setting/update`,
  GET_SELLER_PROFILE: `${BASEURL}/customer/seller-profile`,
  GET_SELLER_REVIEWS: `${BASEURL}/customer/reviews/get-seller-reviews`,
  CREATE_REVIEW: `${BASEURL}/customer/reviews/create`,
};

export const REPORT_LIST = {
  CONTACT_US: `${BASEURL}/report/report-listing`,
};

export const POST = {
  CREATE: `${BASEURL}/post/create-post`,
  GET_ALL: `${BASEURL}/post/get-all`,
  GET_DETAILS: `${BASEURL}/post/get-post-by-id`,
  LIKE: `${BASEURL}/post/wishlist/add-item`,
  UNLIKE: `${BASEURL}/post/wishlist/remove-item`,
  GET_WISHLIST: `${BASEURL}/post/wishlist/get-all`,
  GET_MYADS: `${BASEURL}/post/get-customer-posts`,
};


export const CONTENT = {
  GET : `${BASEURL}/content/get-by-type`
}