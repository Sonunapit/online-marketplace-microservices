import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCart";

import {
  getSellerProducts,
} from "../services/seller.service";

export default function InventoryPage() {
  const [products, setProducts] =
    useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data =
      await getSellerProducts();

    setProducts(
      data.products || []
    );
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold mb-8">
        Inventory
      </h1>

      <div className="grid md:grid-cols-4 gap-5">

        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}

      </div>

    </div>
  );
}