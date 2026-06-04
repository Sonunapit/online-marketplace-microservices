const request = require("supertest");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const orderModel = require("../src/models/order.model");
const app = require("../src/app");

jest.mock("axios");
jest.mock("../src/models/order.model", () => ({
  create: jest.fn(),
}));

const JWT_SECRET = "test-secret";

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
});

const authToken = jwt.sign(
  { id: "648c4aa1f0d5f15d1a6e74a1", role: "user" },
  JWT_SECRET,
);

const shippingAddress = {
  street: "123 Main St",
  city: "Testville",
  state: "TS",
  pincode: "123456",
  country: "Testland",
};

const mockCartResponse = {
  data: {
    items: [
      {
        productId: "648c4aa1f0d5f15d1a6e74a2",
        quantity: 2,
      },
    ],
  },
};

const mockProductResponse = {
  data: {
    product: {
      _id: "648c4aa1f0d5f15d1a6e74a2",
      title: "Test Product",
      price: {
        amount: 500,
        currency: "INR",
      },
      stock: 5,
    },
  },
};

describe("POST /api/orders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates an order when the cart contains valid items", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "http://localhost:3002/api/cart") {
        return Promise.resolve(mockCartResponse);
      }
      if (url === "http://localhost:3001/api/products/648c4aa1f0d5f15d1a6e74a2") {
        return Promise.resolve(mockProductResponse);
      }
      return Promise.reject(new Error(`Unexpected axios call: ${url}`));
    });

    const createdOrder = {
      _id: "648c4aa1f0d5f15d1a6e74a3",
      user: "648c4aa1f0d5f15d1a6e74a1",
      items: [
        {
          product: "648c4aa1f0d5f15d1a6e74a2",
          quantity: 2,
          price: {
            amount: 1000,
            currency: "INR",
          },
        },
      ],
      status: "PENDING",
      totalPrice: {
        amount: 1000,
        currency: "INR",
      },
      shippingAddress,
    };

    orderModel.create.mockResolvedValue(createdOrder);

    const response = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ shippingAddress });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      order: createdOrder,
    });
    expect(orderModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user: "648c4aa1f0d5f15d1a6e74a1",
        status: "PENDING",
        totalPrice: {
          amount: 1000,
          currency: "INR",
        },
        shippingAddress,
      }),
    );
  });

  it("returns 400 when the cart is empty", async () => {
    axios.get.mockResolvedValue({ data: { items: [] } });

    const response = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ shippingAddress });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Cart is empty" });
    expect(orderModel.create).not.toHaveBeenCalled();
  });

  it("returns 400 when shipping address validation fails", async () => {
    const invalidAddress = {
      city: "Testville",
      state: "TS",
      pincode: "00000",
      country: "Testland",
    };

    const response = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ shippingAddress: invalidAddress });

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "shippingAddress.street" }),
        expect.objectContaining({ path: "shippingAddress.pincode" }),
      ]),
    );
    expect(orderModel.create).not.toHaveBeenCalled();
  });

  it("returns 401 when no authorization token is provided", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({ shippingAddress });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Unauthorized: No token provided",
    });
    expect(orderModel.create).not.toHaveBeenCalled();
    expect(axios.get).not.toHaveBeenCalled();
  });
});
