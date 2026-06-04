import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import Navbar
from "../../../components/navbar/Navbar";

import Loader
from "../../../components/common/Loader";

import {
  getProductById,
  deleteProduct,
} from "../services/product.service";

import {
  addToCart,
} from "../../cart/services/cart.service";

const ProductDetailsPage = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [activeImage, setActiveImage] =
    useState(0);

  useEffect(() => {

    fetchProduct();

  }, []);

  // Fetch Product
  const fetchProduct =
    async () => {

      try {

        const response =
          await getProductById(
            id
          );

        setProduct(
          response.data.product
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  // Add To Cart
  const handleAddToCart =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {

          alert(
            "Please Login"
          );

          navigate("/login");

          return;

        }

        await addToCart(
          {
            productId:
              product._id,
            quantity: 1,
          },
          token
        );

        alert(
          "Added To Cart"
        );

      } catch (error) {

        console.log(error);

      }

    };

  // Delete Product
  const handleDelete =
    async () => {

      try {

        const confirmed =
          window.confirm(
            "Delete Product?"
          );

        if (!confirmed) {

          return;

        }

        const token =
          localStorage.getItem(
            "token"
          );

        await deleteProduct(
          product._id,
          token
        );

        alert(
          "Product Deleted"
        );

        navigate(
          "/seller/products"
        );

      } catch (error) {

        console.log(error);

      }

    };

  // Loading
  if (loading) {

    return <Loader />;

  }

  return (

    <div className="min-h-screen bg-gray-100 pb-24">

      <Navbar />

      <div className="max-w-7xl mx-auto px-5 py-10">

        <div className="grid md:grid-cols-2 gap-10">

          {/* Images */}
          <div>

            {/* Main */}
            <img
              src={
                product.images?.[
                  activeImage
                ]?.url ||

                product.images?.[
                  activeImage
                ] ||

                "https://via.placeholder.com/500"
              }
              alt={product.title}
              className="w-full h-[500px] object-cover rounded-3xl"
            />

            {/* Thumbnails */}
            <div className="flex gap-4 mt-4 overflow-x-auto">

              {
                product.images?.map(
                  (
                    image,
                    index
                  ) => (

                    <img
                      key={index}
                      src={
                        image?.url ||
                        image
                      }
                      alt="thumb"
                      onClick={() =>
                        setActiveImage(
                          index
                        )
                      }
                      className={`h-24 w-24 rounded-2xl object-cover cursor-pointer border-4 ${
                        activeImage === index
                          ? "border-black"
                          : "border-transparent"
                      }`}
                    />

                  )
                )
              }

            </div>

          </div>

          {/* Details */}
          <div>

            <h1 className="text-5xl font-bold">

              {
                product.title ||
                product.name
              }

            </h1>

            <p className="text-gray-500 text-lg mt-5 leading-relaxed">

              {
                product.description
              }

            </p>

            <h2 className="text-4xl font-bold mt-8">

              ₹ {
                product.price
                  ?.amount
              }

            </h2>

            <p className="mt-4 text-lg">

              Stock:
              {" "}

              {
                product.stock
              }

            </p>

            {/* USER BUTTONS */}
            {
              user?.role !==
              "seller" && (

                <div className="flex gap-4 mt-10">

                  <button
                    onClick={
                      handleAddToCart
                    }
                    className="bg-black text-white px-8 py-4 rounded-2xl"
                  >

                    Add To Cart

                  </button>

                  <button className="border px-8 py-4 rounded-2xl">

                    Buy Now

                  </button>

                </div>

              )
            }

            {/* SELLER BUTTONS */}
            {
              user?.role ===
              "seller" && (

                <div className="flex gap-4 mt-10">

                  <button
                    onClick={() =>
                      navigate(
                        `/seller/edit-product/${product._id}`
                      )
                    }
                    className="bg-black text-white px-8 py-4 rounded-2xl"
                  >

                    Edit Product

                  </button>

                  <button
                    onClick={
                      handleDelete
                    }
                    className="bg-red-500 text-white px-8 py-4 rounded-2xl"
                  >

                    Delete Product

                  </button>

                </div>

              )
            }

          </div>

        </div>

      </div>

    </div>

  );

};

export default ProductDetailsPage;