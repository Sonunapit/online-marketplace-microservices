const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const orderModel = require("../src/models/order.model");

jest.mock("../src/models/order.model", () => ({
  find: jest.fn(),
  countDocuments: jest.fn(),
}));

const JWT_SECRET = "test-secret";
const authToken = jwt.sign(
  { id: "648c4aa1f0d5f15d1a6e74a1", role: "user" },
  JWT_SECRET,
);

beforeAll(() => {
  process.env.JWT_SECRET = JWT_SECRET;
});

describe("GET /api/orders/me", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns a paginated list of the current user orders", async () => {
    const orders = [
      { _id: "648c4aa1f0d5f15d1a6e74a2", status: "PENDING" },
      { _id: "648c4aa1f0d5f15d1a6e74a3", status: "CONFIRMED" },
    ];

    const query = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnValue(Promise.resolve(orders)),
    };

    orderModel.find.mockReturnValue(query);
    orderModel.countDocuments.mockResolvedValue(2);

    const response = await request(app)
      .get("/api/orders/me?page=1&limit=10")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        orders: expect.arrayContaining([
          expect.objectContaining({ _id: "648c4aa1f0d5f15d1a6e74a2" }),
        ]),
        meta: expect.objectContaining({
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        }),
      }),
    );
  });

  it("returns an empty list when no orders exist for the customer", async () => {
    const query = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnValue(Promise.resolve([])),
    };

    orderModel.find.mockReturnValue(query);
    orderModel.countDocuments.mockResolvedValue(0);

    const response = await request(app)
      .get("/api/orders/me?page=1&limit=5")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      orders: [],
      meta: {
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 0,
      },
    });
  });
});