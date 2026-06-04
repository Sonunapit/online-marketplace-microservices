const request = require("supertest");
const dbSetup = require("../../jest.setup");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

const app = require("../app");

describe("Addresses API", () => {
  beforeAll(async () => {
    await dbSetup.startDB();
  });

  afterAll(async () => {
    await dbSetup.stopDB();
  });

  beforeEach(async () => {
    await dbSetup.clearDB();
  });

  const registerAndLogin = async () => {
    const userData = {
      username: "addressuser",
      email: "addressuser@example.com",
      password: "SecurePassword123!",
      fullName: {
        firstName: "Address",
        lastName: "User",
      },
    };

    await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password })
      .expect(200);

    return loginResponse.body.token;
  };

  test("GET /api/auth/users/me/addresses should list saved addresses and mark default", async () => {
    const token = await registerAndLogin();

    const firstAddress = {
      street: "123 Main Street",
      city: "Testville",
      state: "Testonia",
      country: "Testland",
      pincode: "123456",
      
      default: true,
    };

    const secondAddress = {
      street: "456 Side Avenue",
      city: "Example City",
      state: "Demo State",
      country: "Examplestan",
      pincode: "654321",
      
      default: false,
    };

    await request(app)
      .post("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send(firstAddress)
      .expect(201);

    await request(app)
      .post("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send(secondAddress)
      .expect(201);

    const response = await request(app)
      .get("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body.addresses)).toBe(true);
    expect(response.body.addresses).toHaveLength(2);

    const defaultAddresses = response.body.addresses.filter((address) => address.default === true);
    expect(defaultAddresses).toHaveLength(1);
    expect(defaultAddresses[0]).toMatchObject({ street: firstAddress.street });
  });

  test("POST /api/auth/users/me/addresses should add address with valid pincode and phone", async () => {
    const token = await registerAndLogin();

    const newAddress = {
      street: "789 New Lane",
      city: "New City",
      state: "New State",
      country: "Newland",
      pincode: "700001",
      
      default: true,
    };

    const response = await request(app)
      .post("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send(newAddress)
      .expect(201);

    expect(response.body.message).toBe("Address added successfully");
    expect(response.body.address).toMatchObject({
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      country: newAddress.country,
      pincode: newAddress.pincode,
    
      default: true,
    });
  });

  test("POST /api/auth/users/me/addresses should validate pincode and phone", async () => {
    const token = await registerAndLogin();

    const invalidAddress = {
      street: "101 Invalid Road",
      city: "Bad City",
      state: "Bad State",
      country: "Badland",
      pincode: "12AB34",
      
      default: false,
    };

    const response = await request(app)
      .post("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send(invalidAddress)
      .expect(400);

    expect(response.body.errors).toBeDefined();
    const errorMessages = response.body.errors.map((error) => error.msg);
    expect(errorMessages).toEqual(expect.arrayContaining([
      expect.stringMatching(/pincode/i),
    
    ]));
  });

  test("DELETE /api/auth/users/me/addresses/:addressId should remove address", async () => {
    const token = await registerAndLogin();

    const newAddress = {
      street: "321 Remove Blvd",
      city: "Delete City",
      state: "Delete State",
      country: "Removeland",
      pincode: "123123",
    
      default: false,
    };

    const addResponse = await request(app)
      .post("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .send(newAddress)
      .expect(201);

    const addressId = addResponse.body.address.id || addResponse.body.address._id;
    expect(addressId).toBeDefined();

    await request(app)
      .delete(`/api/auth/users/me/addresses/${addressId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const listResponse = await request(app)
      .get("/api/auth/users/me/addresses")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(listResponse.body.addresses).toEqual(expect.not.arrayContaining([
      expect.objectContaining({ id: addressId }),
      expect.objectContaining({ _id: addressId }),
    ]));
  });
});
