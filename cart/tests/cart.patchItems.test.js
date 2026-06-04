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

describe('PATCH /cart/items/:productId — updateItemQuantity', () => {
  beforeEach(() => jest.clearAllMocks());

  // ── Happy path ─────────────────────────────────────────────────────────────

  test('200 — updates quantity of existing item', async () => {
    const cart = makeCart([{ productId: 'p1', quantity: 2 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.updateItemQuantity(
      mockReq({ params: { productId: 'p1' }, body: { qty: 10 } }), res
    );

    expect(cart.items[0].quantity).toBe(10);
    expect(cart.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Item quantity updated',
        totals: { subtotal: 1000, tax: 100, total: 1100 },
      })
    );
  });

  test('200 — removes item when qty = 0', async () => {
    const cart = makeCart([{ productId: 'p1', quantity: 5 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.updateItemQuantity(
      mockReq({ params: { productId: 'p1' }, body: { qty: 0 } }), res
    );

    expect(cart.items).toHaveLength(0);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Item removed from cart' })
    );
  });

  test('200 — removes item when qty is negative', async () => {
    const cart = makeCart([{ productId: 'p2', quantity: 3 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.updateItemQuantity(
      mockReq({ params: { productId: 'p2' }, body: { qty: -1 } }), res
    );

    expect(cart.items).toHaveLength(0);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('200 — only removes target item, leaves others intact', async () => {
    const cart = makeCart([
      { productId: 'p1', quantity: 2 },
      { productId: 'p2', quantity: 1 },
    ]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.updateItemQuantity(
      mockReq({ params: { productId: 'p1' }, body: { qty: 0 } }), res
    );

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].productId).toBe('p2');
  });

  test('200 — recalculates totals correctly after update', async () => {
    // p2: 200 × 3 = 600 → tax 60 → total 660
    const cart = makeCart([{ productId: 'p2', quantity: 1 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.updateItemQuantity(
      mockReq({ params: { productId: 'p2' }, body: { qty: 3 } }), res
    );

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totals: { subtotal: 600, tax: 60, total: 660 },
      })
    );
  });

  // ── Stock validation ───────────────────────────────────────────────────────

  test('400 — rejects qty exceeding stock', async () => {
    // p1 stock = 50
    const cart = makeCart([{ productId: 'p1', quantity: 5 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.updateItemQuantity(
      mockReq({ params: { productId: 'p1' }, body: { qty: 99 } }), res
    );

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Insufficient stock for requested quantity',
        available: 50,
        requested: 99,
      })
    );
  });

  // ── Not found ──────────────────────────────────────────────────────────────

  test('404 — unknown productId', async () => {
    const res = mockRes();
    await cartController.updateItemQuantity(
      mockReq({ params: { productId: 'p999' }, body: { qty: 1 } }), res
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Product not found' })
    );
  });

  test('404 — cart does not exist', async () => {
    cartModel.findOne.mockResolvedValue(null);

    const res = mockRes();
    await cartController.updateItemQuantity(
      mockReq({ params: { productId: 'p1' }, body: { qty: 2 } }), res
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Cart not found' })
    );
  });

  test('404 — item not in cart', async () => {
    const cart = makeCart([{ productId: 'p2', quantity: 1 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.updateItemQuantity(
      mockReq({ params: { productId: 'p1' }, body: { qty: 2 } }), res
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Item not found in cart' })
    );
  });

  // ── Server error ───────────────────────────────────────────────────────────

  test('500 — DB error returns error message', async () => {
    cartModel.findOne.mockRejectedValue(new Error('DB failure'));

    const res = mockRes();
    await cartController.updateItemQuantity(
      mockReq({ params: { productId: 'p1' }, body: { qty: 1 } }), res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Failed to update item quantity', message: 'DB failure' })
    );
  });
});
