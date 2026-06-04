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

describe('DELETE /cart/items/:productId — removeItemFromCart', () => {
  beforeEach(() => jest.clearAllMocks());

  test('200 — removes specified item and returns updated cart', async () => {
    const cart = makeCart([
      { productId: 'p1', quantity: 2 },
      { productId: 'p2', quantity: 1 },
    ]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.removeItemFromCart(
      mockReq({ params: { productId: 'p1' } }), res
    );

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].productId).toBe('p2');
    expect(cart.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Item removed from cart' })
    );
  });

  test('200 — recalculates totals after removal', async () => {
    // only p2 remains: 200 × 1 = 200, tax 20, total 220
    const cart = makeCart([
      { productId: 'p1', quantity: 3 },
      { productId: 'p2', quantity: 1 },
    ]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.removeItemFromCart(
      mockReq({ params: { productId: 'p1' } }), res
    );

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totals: { subtotal: 200, tax: 20, total: 220 },
      })
    );
  });

  test('200 — returns empty totals when last item removed', async () => {
    const cart = makeCart([{ productId: 'p1', quantity: 1 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.removeItemFromCart(
      mockReq({ params: { productId: 'p1' } }), res
    );

    expect(cart.items).toHaveLength(0);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totals: { subtotal: 0, tax: 0, total: 0 },
      })
    );
  });

  test('404 — cart does not exist', async () => {
    cartModel.findOne.mockResolvedValue(null);

    const res = mockRes();
    await cartController.removeItemFromCart(
      mockReq({ params: { productId: 'p1' } }), res
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
    await cartController.removeItemFromCart(
      mockReq({ params: { productId: 'p1' } }), res
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Item not found in cart' })
    );
  });

  test('500 — DB error returns error message', async () => {
    cartModel.findOne.mockRejectedValue(new Error('DB failure'));

    const res = mockRes();
    await cartController.removeItemFromCart(
      mockReq({ params: { productId: 'p1' } }), res
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Failed to remove item', message: 'DB failure' })
    );
  });
});

describe('DELETE /cart — clearCart', () => {
  beforeEach(() => jest.clearAllMocks());

  test('200 — clears all items and returns zero totals', async () => {
    const cart = makeCart([
      { productId: 'p1', quantity: 2 },
      { productId: 'p2', quantity: 3 },
    ]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.clearCart(mockReq(), res);

    expect(cart.items).toHaveLength(0);
    expect(cart.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Cart cleared',
      items: [],
      totals: { subtotal: 0, tax: 0, total: 0 },
    });
  });

  test('404 — cart does not exist', async () => {
    cartModel.findOne.mockResolvedValue(null);

    const res = mockRes();
    await cartController.clearCart(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Cart not found' })
    );
  });

  test('500 — DB error returns error message', async () => {
    cartModel.findOne.mockRejectedValue(new Error('DB failure'));

    const res = mockRes();
    await cartController.clearCart(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Failed to clear cart', message: 'DB failure' })
    );
  });
});
