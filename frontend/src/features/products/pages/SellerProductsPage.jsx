import {
  useEffect,
  useState,
} from "react";

import Navbar
from "../../../components/navbar/Navbar";

import Loader
from "../../../components/common/Loader";

import EmptyState
from "../../../components/common/EmptyState";

import SellerProductCard
from "../components/SellerProductCard";

import {
  getSellerProducts,
  deleteProduct,
} from "../services/product.service";

const SellerProductsPage =
  () => {

    const [products, setProducts] =
      useState([]);

    const [loading, setLoading] =
      useState(true);

    useEffect(() => {

      fetchProducts();

    }, []);

    const fetchProducts =
  async () => {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await getSellerProducts(
          token
        );

      console.log(
        response.data
      );

      setProducts(
        response.data.data || []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

    const handleDelete =
      async (id) => {

        try {

          const token =
            localStorage.getItem(
              "token"
            );

          await deleteProduct(
            id,
            token
          );

          setProducts(
            products.filter(
              (product) =>
                product._id !== id
            )
          );

          alert(
            "Product Deleted"
          );

        } catch (error) {

          console.log(error);

        }

      };

    if (loading) {

      return <Loader />;

    }

    return (

      <div className="min-h-screen bg-gray-100 pb-24">

        <Navbar />

        <div className="max-w-7xl mx-auto px-5 py-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

            <div>

              <h1 className="text-4xl font-bold">

                Seller Products

              </h1>

              <p className="text-gray-500 mt-2">

                Manage your products

              </p>

            </div>

            <a
              href="/seller/create-product"
              className="bg-black text-white px-6 py-3 rounded-2xl text-center"
            >

              Create Product

            </a>

          </div>

          {/* Products */}
         {
  !products ||
  products.length === 0 ? (

    <EmptyState
      title="No Products Found"
    />

  ) : (

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {
        products.map(
          (product) => (

            <SellerProductCard
              key={product._id}
              product={product}
            />

          )
        )
      }

    </div>

  )
}

        </div>

      </div>

    );

};

export default SellerProductsPage;