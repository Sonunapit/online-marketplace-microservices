const cartController = require('../src/controllers/cart.controller');
const cartModel = require('../src/models/cart.model');

jest.mock('../src/models/cart.model');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

function mockReq(overrides = {}) {
  return { user: { _id: 'testUser' }, body: {}, params: {}, ...overrides };
}

function makeCart(items = []) {
  return { items, save: jest.fn().mockResolvedValue(true) };
}

describe('POST /cart/items — addItemToCart', () => {
  beforeEach(() => jest.clearAllMocks());

  // ── Happy path ─────────────────────────────────────────────────────────────

  test('201 — adds new item to empty cart', async () => {
    const cart = makeCart([]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p1', qty: 2 } }), res);

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toMatchObject({ productId: 'p1', quantity: 2 });
    expect(cart.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Item added to cart',
        totals: { subtotal: 200, tax: 20, total: 220 },
      })
    );
  });

  test('201 — increments quantity when item already in cart', async () => {
    const cart = makeCart([{ productId: 'p1', quantity: 3 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p1', qty: 5 } }), res);

    expect(cart.items[0].quantity).toBe(8);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('201 — creates new cart when none exists, then adds item', async () => {
    cartModel.findOne.mockResolvedValue(null);
    const newCart = makeCart([]);
    cartModel.mockImplementation(() => newCart);

    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p2', qty: 1 } }), res);

    expect(newCart.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('201 — adds a second distinct item alongside existing one', async () => {
    const cart = makeCart([{ productId: 'p1', quantity: 1 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p2', qty: 2 } }), res);

    expect(cart.items).toHaveLength(2);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  // ── Stock validation ───────────────────────────────────────────────────────

  test('400 — rejects when qty alone exceeds stock', async () => {
    const cart = makeCart([]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p1', qty: 60 } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Insufficient stock available', available: 50, requested: 60 })
    );
  });

  test('400 — rejects when existing + new qty exceeds stock', async () => {
    // p1 stock = 50; already 45 in cart, adding 10 → 55
    const cart = makeCart([{ productId: 'p1', quantity: 45 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p1', qty: 10 } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ available: 50, requested: 55 })
    );
  });

  test('400 — rejects out-of-stock product (p3 stock = 0)', async () => {
    const cart = makeCart([]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p3', qty: 1 } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ── Input validation ───────────────────────────────────────────────────────

  test('400 — rejects qty = 0', async () => {
    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p1', qty: 0 } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'qty must be a positive integer' })
    );
  });

  test('400 — rejects negative qty', async () => {
    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p1', qty: -5 } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('400 — rejects float qty', async () => {
    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p1', qty: 1.5 } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // ── Not found ──────────────────────────────────────────────────────────────

  test('404 — unknown productId', async () => {
    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p999', qty: 1 } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Product not found' })
    );
  });

  // ── Server error ───────────────────────────────────────────────────────────

  test('500 — DB error returns error message', async () => {
    cartModel.findOne.mockRejectedValue(new Error('DB failure'));

    const res = mockRes();
    await cartController.addItemToCart(mockReq({ body: { productId: 'p1', qty: 1 } }), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Failed to add item to cart', message: 'DB failure' })
    );
  });
});
