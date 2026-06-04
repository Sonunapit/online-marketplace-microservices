const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const orderModel = require("../src/models/order.model");

jest.mock("../src/models/order.model", () => ({
  findById: jest.fn(),
}));

const JWT_SECRET = "test-secret";
const authToken = jwt.sign(
  { id: "648c4aa1f0d5f15d1a6e74a1", role: "user" },
  JWT_SECRET,
);

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
});

describe("GET /api/orders/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an order with timeline and payment summary", async () => {
    const orderId = "648c4aa1f0d5f15d1a6e74a2";
    const order = {
      _id: orderId,
      user: "648c4aa1f0d5f15d1a6e74a1",
      status: "PAID",
      timeline: [
        { status: "PENDING", at: "2026-05-30T12:00:00.000Z" },
        { status: "PAID", at: "2026-05-31T09:15:00.000Z" },
      ],
      paymentSummary: {
        method: "CARD",
        status: "CAPTURED",
        amount: { amount: 1000, currency: "INR" },
      },
    };

    orderModel.findById.mockResolvedValue(order);

    const response = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        order: expect.objectContaining({
          _id: orderId,
          timeline: expect.any(Array),
          paymentSummary: expect.objectContaining({
            method: "CARD",
            status: "CAPTURED",
          }),
        }),
      }),
    );
  });

  it("returns 404 when the order does not exist", async () => {
    orderModel.findById.mockResolvedValue(null);

    const response = await request(app)
      .get("/api/orders/648c4aa1f0d5f15d1a6e74a9")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Order not found",
    });
  });

  it("returns 401 when the request is unauthorized", async () => {
    const response = await request(app).get("/api/orders/648c4aa1f0d5f15d1a6e74a2");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Unauthorized: No token provided",
    });
  });
});