import { useEffect, useState } from "react";
import { Banner } from "../../components/Home/Banner";
import { GetApplications } from "../../components/Home/GetApplications";
import { ImageSlider } from "../../components/Home/ImageSlider";
import { Products } from "../../components/Home/Products";
import { getRequest } from "../../config/apiFunctions";
import { POST } from "../../config/endPoints";

export const HomePage = () => {
  const imagePath = import.meta.env.VITE_APP_IMAGE_URL;
  const [allPosts, setAllPosts] = useState([]);

  const getAllPosts = async (url) => {
    const response = await getRequest(url);
    if (response?.data?.success && response?.data?.statusCode === 200) {
      setAllPosts(response?.data?.data?.posts);
    }
  };

  useEffect(() => {
    getAllPosts(`${POST.GET_ALL}?page=${1}&limit=8`);
  }, []);

  return (
    <>
      <Banner />
      <ImageSlider />
      <Products allPosts={allPosts} imagePath={imagePath} />
      <GetApplications />
    </>
  );
};
