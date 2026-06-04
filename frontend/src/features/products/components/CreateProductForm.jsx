import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  createProduct,
} from "../services/product.service";

const CreateProductForm = () => {

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      price: "",
      stock: "",
      images: [],
    });

  // Input Change
  const handleChange =
    (e) => {

      setFormData({
        ...formData,
        [e.target.name]:
          e.target.value,
      });

    };

  // Handle Images
  const handleImageChange =
    (e) => {

      const files =
        Array.from(
          e.target.files
        );

      // Max 5 Images
      if (
        files.length > 5
      ) {

        alert(
          "Maximum 5 images allowed"
        );

        return;

      }

      setFormData({
        ...formData,
        images: files,
      });

    };

  // Submit
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const data =
          new FormData();

        // Backend Fields
        data.append(
          "title",
          formData.name
        );

        data.append(
          "description",
          formData.description
        );

        data.append(
          "priceAmount",
          formData.price
        );

        data.append(
          "priceCurrency",
          "INR"
        );

        data.append(
          "stock",
          formData.stock
        );

        // Images
        for (
          let i = 0;
          i <
          formData.images.length;
          i++
        ) {

          data.append(
            "images",
            formData.images[i]
          );

        }

        // Debug
        console.log(
          [...data.entries()]
        );

        await createProduct(
          data,
          token
        );

        alert(
          "Product Created Successfully"
        );

        navigate(
          "/seller/products"
        );

      } catch (error) {

        console.log(error);

        console.log(
          error.response?.data
        );

        alert(
          error.response?.data
            ?.message ||
          "Create Product Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <form
      onSubmit={
        handleSubmit
      }
      className="bg-white p-6 md:p-10 rounded-3xl shadow-sm"
    >

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8">

        Create Product

      </h1>

      {/* Product Name */}
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        className="w-full border p-3 rounded-xl mb-4 outline-none focus:border-black"
        onChange={
          handleChange
        }
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder="Description"
        rows="5"
        className="w-full border p-3 rounded-xl mb-4 outline-none focus:border-black"
        onChange={
          handleChange
        }
      />

      {/* Price */}
      <input
        type="number"
        name="price"
        placeholder="Price"
        className="w-full border p-3 rounded-xl mb-4 outline-none focus:border-black"
        onChange={
          handleChange
        }
      />

      {/* Stock */}
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        className="w-full border p-3 rounded-xl mb-6 outline-none focus:border-black"
        onChange={
          handleChange
        }
      />

      {/* Images */}
      <div className="mb-6">

        <label className="block text-lg font-semibold mb-3">

          Product Images

        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full border p-3 rounded-xl"
          onChange={
            handleImageChange
          }
        />

        <p className="text-gray-500 text-sm mt-2">

          Upload up to 5 images

        </p>

      </div>

      {/* Preview */}
      {
        formData.images.length > 0 && (

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

            {
              formData.images.map(
                (
                  image,
                  index
                ) => (

                  <div
                    key={index}
                    className="relative"
                  >

                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="h-32 w-full object-cover rounded-2xl border"
                    />

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => {

                        const updatedImages =
                          formData.images.filter(
                            (_, i) =>
                              i !== index
                          );

                        setFormData({
                          ...formData,
                          images:
                            updatedImages,
                        });

                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white h-8 w-8 rounded-full"
                    >

                      ✕

                    </button>

                  </div>

                )
              )
            }

          </div>

        )
      }

      {/* Submit */}
      <button
        disabled={loading}
        className="w-full bg-black text-white p-4 rounded-2xl text-lg font-semibold hover:opacity-90 transition"
      >

        {
          loading
            ? "Creating..."
            : "Create Product"
        }

      </button>

    </form>

  );

};

export default CreateProductForm;