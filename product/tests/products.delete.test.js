jest.mock('../src/middlewares/auth.middleware', () => {
  return jest.fn(() => {
    return (req, res, next) => {

      req.user = {
        id: '507f1f77bcf86cd799439011',
        role: 'seller'
      }

      next()
    }
  })
})


jest.mock('../src/services/imagekit.service', () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn()
}))



jest.mock("../src/models/product.model", () => ({
  findOne: jest.fn(),
}));

const request = require("supertest");
const app = require("../src/app");
const productModel = require("../src/models/product.model");

describe("DELETE /api/products/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes the product when the seller owns it", async () => {
    const product = {
      _id: "648f1f77bcf86cd799439011",
      title: "Product to delete",
      seller: "507f1f77bcf86cd799439011",
      deleteOne: jest.fn().mockResolvedValue({}),
    };

    productModel.findOne.mockResolvedValue(product);

    const response = await request(app).delete(
      "/api/products/648f1f77bcf86cd799439011"
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Product deleted" });
    expect(productModel.findOne).toHaveBeenCalledWith({
      _id: "648f1f77bcf86cd799439011",
      seller: "507f1f77bcf86cd799439011",
    });
    expect(product.deleteOne).toHaveBeenCalled();
  });

  it("returns 403 when the seller does not own the product", async () => {
    productModel.findOne.mockResolvedValue(null);

    const response = await request(app).delete(
      "/api/products/648f1f77bcf86cd799439011"
    );

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: "Forbidden: Cannot delete this product",
    });
  });

  it("returns 400 when the product id is invalid", async () => {
    const response = await request(app).delete("/api/products/invalid-id");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid product id" });
  });
});
