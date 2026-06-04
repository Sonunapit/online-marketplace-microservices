jest.mock("../src/middlewares/auth.middleware", () => {
  return jest.fn(() => {
    return (req, res, next) => {
      req.user = {
        id: "507f1f77bcf86cd799439011",
        role: "seller",
      };

      next();
    };
  });
});

jest.mock("../src/services/imagekit.service", () => ({
  uploadImage: jest.fn(),
}));

jest.mock("../src/models/product.model", () => ({
  findOne: jest.fn(),
}));

const request = require("supertest");
const app = require("../src/app");
const productModel = require("../src/models/product.model");

describe("PATCH /api/products/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates product fields when the seller owns the product", async () => {
    const product = {
      _id: "648f1f77bcf86cd799439011",
      title: "Original Title",
      description: "Original description",
      price: {
        amount: 100,
        currency: "INR",
      },
      seller: "507f1f77bcf86cd799439011",
      images: [],
      save: jest.fn().mockResolvedValue(true),
    };

    productModel.findOne.mockResolvedValue(product);

    const response = await request(app)
      .patch("/api/products/648f1f77bcf86cd799439011")
      .send({
        title: "Updated Title",
        description: "Updated description",
        priceAmount: "150",
        priceCurrency: "USD",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message: "Product updated",
      data: {
        _id: "648f1f77bcf86cd799439011",
        title: "Updated Title",
        description: "Updated description",
        price: {
          amount: 150,
          currency: "USD",
        },
        seller: "507f1f77bcf86cd799439011",
        images: [],
      },
    });

    expect(product.save).toHaveBeenCalled();
  });

  it("returns 403 when a seller tries to update a product they do not own", async () => {
    productModel.findOne.mockResolvedValue(null);

    const response = await request(app)
      .patch("/api/products/648f1f77bcf86cd799439011")
      .send({
        title: "Attempted Update",
      });

    expect(response.status).toBe(403);

    expect(response.body).toEqual({
      message: "Forbidden: Cannot update this product",
    });
  });
});
