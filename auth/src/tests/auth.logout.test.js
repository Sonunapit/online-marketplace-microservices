const request = require("supertest");
const dbSetup = require("../../jest.setup");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

const app = require("../app");

describe("GET /api/auth/logout", () => {
  beforeAll(async () => {
    await dbSetup.startDB();
  });

  afterAll(async () => {
    await dbSetup.stopDB();
  });

  beforeEach(async () => {
    await dbSetup.clearDB();
  });

  test("should logout a user successfully and clear the token cookie", async () => {
    const userData = {
      username: "logoutuser",
      email: "logout@example.com",
      password: "SecurePassword123!",
      fullName: {
        firstName: "Logout",
        lastName: "Test",
      },
    };

    // Register the user
    await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    // Login the user
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    const token = loginResponse.body.token;

    // Logout the user
    const logoutResponse = await request(app)
      .get("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(logoutResponse.body.message).toBe("Logout successful");
  });

  test("should clear the token cookie after logout", async () => {
    const userData = {
      username: "cookieclearuser",
      email: "clearcookie@example.com",
      password: "Password123!",
      fullName: {
        firstName: "Cookie",
        lastName: "Clear",
      },
    };

    // Register the user
    await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    // Login the user
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    const token = loginResponse.body.token;

    // Logout the user
    const logoutResponse = await request(app)
      .get("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    // Check that the cookie is cleared
    const setCookieHeaders = logoutResponse.headers["set-cookie"];
    expect(setCookieHeaders).toBeDefined();
    const tokenCookie = setCookieHeaders.find((cookie) => cookie.includes("token="));
    expect(tokenCookie).toContain("Max-Age=0");
  });

  test("should return 401 when logout is attempted without authentication", async () => {
    const response = await request(app)
      .get("/api/auth/logout")
      .expect(401);

    expect(response.body.message).toBe("Not authorized");
  });

  test("should return 401 when logout is attempted with an invalid token", async () => {
    const response = await request(app)
      .get("/api/auth/logout")
      .set("Authorization", "Bearer invalid_token")
      .expect(401);

    expect(response.body.message).toBe("jwt malformed");
  });

  test("should logout a user when using cookie-based authentication", async () => {
    const userData = {
      username: "cookieauthuser",
      email: "cookieauth@example.com",
      password: "Password123!",
      fullName: {
        firstName: "Cookie",
        lastName: "Auth",
      },
    };

    // Register the user
    await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    // Login the user
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    // Get the token cookie
    const cookies = loginResponse.headers["set-cookie"];

    // Logout using cookie authentication
    const logoutResponse = await request(app)
      .get("/api/auth/logout")
      .set("Cookie", cookies)
      .expect(200);

    expect(logoutResponse.body.message).toBe("Logout successful");
  });
});
