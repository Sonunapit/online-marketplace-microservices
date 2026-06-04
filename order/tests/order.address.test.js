const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const orderModel = require("../src/models/order.model");

jest.mock("../src/models/order.model", () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const JWT_SECRET = "test-secret";
const authToken = jwt.sign(
  { id: "648c4aa1f0d5f15d1a6e74a1", role: "user" },
  JWT_SECRET,
);

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
});

describe("PATCH /api/orders/:id/address", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates the delivery address and returns the updated order", async () => {
    const orderId = "648c4aa1f0d5f15d1a6e74a6";
    const currentOrder = {
      _id: orderId,
      status: "PENDING",
      shippingAddress: {
        street: "Old St",
        city: "Oldcity",
        state: "OS",
        pincode: "111111",
        country: "Oldland",
      },
      user: "648c4aa1f0d5f15d1a6e74a1",
      save: jest.fn().mockResolvedValue(true),
    };
    const newAddress = {
      street: "456 New St",
      city: "Newville",
      state: "NS",
      pincode: "654321",
      country: "Newland",
    };

    orderModel.findById.mockResolvedValue(currentOrder);

    const response = await request(app)
      .patch(`/api/orders/orders/${orderId}/address`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ shippingAddress: newAddress });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Address updated successfully",
        order: expect.objectContaining({
          shippingAddress: expect.objectContaining({
            street: "456 New St",
          }),
        }),
      }),
    );
    expect(currentOrder.save).toHaveBeenCalled();
  });

  it("returns 404 when the order is not found", async () => {
    orderModel.findById.mockResolvedValue(null);

    const response = await request(app)
      .patch("/api/orders/orders/648c4aa1f0d5f15d1a6e74a7/address")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ shippingAddress: { street: "New St" } });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Order not found",
    });
  });
});