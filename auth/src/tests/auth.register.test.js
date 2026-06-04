const request = require("supertest");
const app = require("../app");
const userModel = require("../models/user.model");
const dbSetup = require("../../jest.setup");

describe("POST /api/auth/register", () => {

  beforeAll(async () => {
    await dbSetup.startDB();
  });

  afterAll(async () => {
    await dbSetup.stopDB();
  });

  beforeEach(async () => {
    await dbSetup.clearDB();
  });

  describe("Successful Registration", () => {

    test("should register a new user with valid data", async () => {

      const userData = {
        username: "testuser123",
        email: "test@example.com",
        password: "SecurePassword123!",
        fullName: {
          firstName: "John",
          lastName: "Doe",
        },
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.message)
        .toBe("User registered Succsefully");

      expect(response.body.user)
        .toHaveProperty("id");

      expect(response.body.user.username)
        .toBe(userData.username);

      expect(response.body.user.email)
        .toBe(userData.email);

      expect(response.body.user.fullName.firstName)
        .toBe(userData.fullName.firstName);

      expect(response.body.user.fullName.lastName)
        .toBe(userData.fullName.lastName);

      // Database check
      const savedUser = await userModel
        .findOne({
          email: userData.email,
        })
        .select("+password");

      expect(savedUser).toBeDefined();

      expect(savedUser.username)
        .toBe(userData.username);

      expect(savedUser.password)
        .not.toBe(userData.password);

      expect(savedUser.password)
        .toBeDefined();

    });

    test("should hash password before saving", async () => {

      const userData = {
        username: "testuser456",
        email: "test456@example.com",
        password: "MyPassword123!",
        fullName: {
          firstName: "Jane",
          lastName: "Smith",
        },
      };

      await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      const savedUser = await userModel
        .findOne({
          email: userData.email,
        })
        .select("+password");

      expect(savedUser.password)
        .not.toBe(userData.password);

      expect(savedUser.password)
        .toBeDefined();

    });

  });

  describe("Duplicate User Errors", () => {

    test("should return 402 if user already exists", async () => {

      const userData = {
        username: "sameuser",
        email: "same@example.com",
        password: "Password123!",
        fullName: {
          firstName: "John",
          lastName: "Doe",
        },
      };

      // First registration
      await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      // Duplicate registration
      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(402);

      expect(response.body.message)
        .toBe("User or email already exist");

    });

  });

});
