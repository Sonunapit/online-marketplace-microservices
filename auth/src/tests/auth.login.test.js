const request = require("supertest");
const dbSetup = require("../../jest.setup");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

const app = require("../app");

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    await dbSetup.startDB();
  });

  afterAll(async () => {
    await dbSetup.stopDB();
  });

  beforeEach(async () => {
    await dbSetup.clearDB();
  });

  test("should login a registered user with valid credentials", async () => {
    const userData = {
      username: "testuser123",
      email: "test@example.com",
      password: "SecurePassword123!",
      fullName: {
        firstName: "John",
        lastName: "Doe",
      },
    };

    await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    expect(response.body.message).toBe("Login successful");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.user.username).toBe(userData.username);
    expect(response.body.user.fullName.firstName).toBe(userData.fullName.firstName);
    expect(response.body.user.fullName.lastName).toBe(userData.fullName.lastName);
  });

  test("should set an HTTP-only cookie after successful login", async () => {
    const userData = {
      username: "cookieuser",
      email: "cookie@example.com",
      password: "Password123!",
      fullName: {
        firstName: "Cookie",
        lastName: "Test",
      },
    };

    await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    expect(response.headers["set-cookie"]).toBeDefined();
    const tokenCookie = response.headers["set-cookie"].find((cookie) => cookie.includes("token="));
    expect(tokenCookie).toBeDefined();
    expect(tokenCookie).toContain("HttpOnly");
  });

  test("should return 401 when login is attempted for a non-existent user", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "missing@example.com", password: "Password123!" })
      .expect(401);

    expect(response.body.message).toBe("Invalid username and email or password");
  });

  test("should return 401 when the password is incorrect", async () => {
    const userData = {
      username: "wrongpassuser",
      email: "wrongpass@example.com",
      password: "CorrectPassword123!",
      fullName: {
        firstName: "Wrong",
        lastName: "Pass",
      },
    };

    await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: "IncorrectPassword123!" })
      .expect(401);

    expect(response.body.message).toBe("Invalid email or password");
  });

  test("should return 400 for invalid email format", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalid-email", password: "Password123!" })
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.some((error) => error.msg.includes("Invalid email address"))).toBe(true);
  });

  test("should return 400 when password is too short", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "short" })
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.some((error) => error.msg.includes("Password must be at least 6 characters long"))).toBe(true);
  });

  test("should return 400 when email is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ password: "Password123!" })
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.length).toBeGreaterThan(0);
  });

  test("should return 400 when password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com" })
      .expect(400);

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors.length).toBeGreaterThan(0);
  });
});