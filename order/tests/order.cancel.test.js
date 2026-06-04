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

describe("POST /api/orders/:id/cancel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("cancels a pending order and returns the updated order", async () => {
    const orderId = "648c4aa1f0d5f15d1a6e74a4";
    const order = {
      _id: orderId,
      status: "PENDING",
      user: "648c4aa1f0d5f15d1a6e74a1",
      save: jest.fn().mockResolvedValue(true),
    };

    orderModel.findById.mockResolvedValue(order);

    const response = await request(app)
      .post(`/api/orders/${orderId}/cancel`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Order cancelled successfully",
        order: expect.objectContaining({ status: "CANCELLED" }),
      }),
    );
    expect(order.save).toHaveBeenCalled();
  });

  it("returns 409 when the order cannot be canceled", async () => {
    orderModel.findById.mockResolvedValue({
      _id: "648c4aa1f0d5f15d1a6e74a5",
      status: "SHIPPED",
      user: "648c4aa1f0d5f15d1a6e74a1",
    });

    const response = await request(app)
      .post("/api/orders/648c4aa1f0d5f15d1a6e74a5/cancel")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "Order cannot be cancelled at this time",
    });
  });
});