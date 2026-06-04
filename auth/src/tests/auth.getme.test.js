const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const dbSetup = require("../../jest.setup");
const userModel = require("../models/user.model");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

describe("GET /api/auth/me", () => {
  let authToken;
  let userId;
  const userData = {
    username: "testuser123",
    email: "test@example.com",
    password: "SecurePassword123!",
    fullName: {
      firstName: "John",
      lastName: "Doe",
    },
  };

  beforeAll(async () => {
    await dbSetup.startDB();
  });

  afterAll(async () => {
    await dbSetup.stopDB();
  });

  beforeEach(async () => {
    await dbSetup.clearDB();

    // Register a test user
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    userId = registerRes.body.user.id;

    // Login to get the auth token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    authToken = loginRes.body.token || loginRes.headers["set-cookie"];
  });

  describe("Successful Authentication", () => {
    test("should return authenticated user profile with valid token in header", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe("User profile retrieved successfully");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.fullName.firstName).toBe(userData.fullName.firstName);
      expect(response.body.user.fullName.lastName).toBe(userData.fullName.lastName);
    });

     test("should return authenticated user profile with token in cookies", async () => {

  const response = await request(app)
    .get("/api/auth/me")
    .set("Cookie", `token=${authToken}`)
    .expect(200);

  expect(response.body.message)
    .toBe("User profile retrieved successfully");

  expect(response.body.user)
    .toHaveProperty("id");

  expect(response.body.user.email)
    .toBe(userData.email);

});

    test("should return correct user data matching the authenticated user", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      const dbUser = await userModel.findById(userId);

      expect(response.body.user.id).toBe(dbUser._id.toString());
      expect(response.body.user.username).toBe(dbUser.username);
      expect(response.body.user.email).toBe(dbUser.email);
    });

    test("should not include password in the user profile response", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.user).not.toHaveProperty("password");
    });
  });

  describe("Authentication Errors", () => {
    test("should return 401 when no token is provided", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .expect(401);

      expect(response.body.message).toMatch(/not authorized|no token|unauthorized/i);
    });

    test("should return 401 when invalid token format is provided", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "InvalidTokenFormat")
        .expect(401);

      expect(response.body.message).toMatch(/invalid|malformed|not authorized/i);
    });

    test("should return 401 with malformed Bearer token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid.token.format")
        .expect(401);

      expect(response.body.message).toMatch(/invalid|malformed|not authorized/i);
    });

    test("should return 401 with expired token", async () => {
      const expiredToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "-1h" } // Token that expired 1 hour ago
      );

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.message).toMatch(/expired|not authorized/i);
    });

    test("should return 401 when authorization header is missing", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .expect(401);

      expect(response.body.message).toBeDefined();
    });

    test("should return 401 when token is tampered with", async () => {
      const tamperedToken = authToken + "tampereddata";

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${tamperedToken}`)
        .expect(401);

      expect(response.body.message).toMatch(/invalid|malformed|not authorized/i);
    });

    test("should return 404 when authenticated user does not exist in database", async () => {
      // Create a valid token for a non-existent user
      const fakeUserId = "507f1f77bcf86cd799439011";
      const validToken = jwt.sign(
        { userId: fakeUserId },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(404);

      expect(response.body.message).toMatch(/not found|user does not exist/i);
    });
  });

  describe("Header Validation", () => {
    test("should accept Bearer token case-insensitive in header", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `bearer ${authToken}`)
        .expect(200);

      expect(response.body.user).toBeDefined();
    });

    test("should handle multiple spaces in Authorization header", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer  ${authToken}`)
        .expect(401);

      expect(response.body.message).toBeDefined();
    });
  });
});
