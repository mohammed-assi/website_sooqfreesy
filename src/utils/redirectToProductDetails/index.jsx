// import { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { ROUTE } from "../../config/constants";

// const ProductDetailsRedirect = () => {
//   const { encodedId } = useParams();
//   const navigate = useNavigate();

//   console.log("encodedId", encodedId);

//   useEffect(() => {
//     try {
//       const decodedId = atob(encodedId); // Decode Base64 to ID
//       if (!isNaN(decodedId)) {
//         navigate(`${ROUTE.PRODUCT_PAGE}/${decodedId}`, { replace: true });
//       } else {
//         navigate(`${ROUTE.PRODUCT_PAGE}/:id`);
//       }
//     } catch (error) {
//       navigate("*");
//     }
//   }, [encodedId, navigate]);

//   return null; // nothing to show while redirecting
// };

// export default ProductDetailsRedirect;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductDetail } from "../../pages/productDetail";
import { ScreenLoader } from "../screenLoader";
import NotFoundPage from "../../pages/notFoundPage";

const ProductDetailsWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [decodedId, setDecodedId] = useState(null);

  useEffect(() => {
    if (!isNaN(id)) {
      setDecodedId(id);
      return;
    }

    try {
      const decoded = atob(id);
      if (!isNaN(decoded)) {
        navigate(`/products/${decoded}`, { replace: true });
      } else {
        setDecodedId(null);
      }
    } catch (err) {
      setDecodedId(null);
    }
  }, [id, navigate]);

  if (decodedId === null && isNaN(id)) {
    return <NotFoundPage />;
  }

  if (!decodedId && isNaN(id)) {
    return <ScreenLoader />;
  }

  return <ProductDetail />;
};

export default ProductDetailsWrapper;
