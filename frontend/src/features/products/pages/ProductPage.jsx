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

import ProductCard
from "../components/ProductCard";

import {
  getProducts,
} from "../services/product.service";

const ProductPage = () => {

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

      const response =
        await getProducts();

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

  return (

    <div className="min-h-screen bg-gray-100 pb-24">

      <Navbar />

      <div className="max-w-7xl mx-auto px-5 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          <h1 className="text-4xl font-bold">

            Products

          </h1>

        </div>

        {/* Products */}
        {
          !products ||
          products.length === 0 ? (

            <EmptyState
              title="No Products Found"
            />

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {
                products.map(
                  (product) => (

                    <ProductCard
                      key={
                        product._id
                      }
                      product={
                        product
                      }
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

export default ProductPage;