import { Banner } from "../../components/Home/Banner";
import { GetApplications } from "../../components/Home/GetApplications";
import { ImageSlider } from "../../components/Home/ImageSlider";
import { Products } from "../../components/Home/Products";

export const HomePage = () => {
  return (
    <>
      <Banner />
      <ImageSlider />
      <Products />
      <GetApplications />
    </>
  );
};
