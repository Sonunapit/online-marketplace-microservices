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

describe('GET /cart — getCart', () => {
  beforeEach(() => jest.clearAllMocks());

  test('200 — returns existing cart with computed totals', async () => {
    const cart = makeCart([{ productId: 'p1', quantity: 2 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.getCart(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({ productId: 'p1', qty: 2, price: 100, lineTotal: 200 }),
        ]),
        totals: { subtotal: 200, tax: 20, total: 220 },
      })
    );
  });

  test('200 — creates new cart when none exists', async () => {
    cartModel.findOne.mockResolvedValue(null);
    const newCart = makeCart([]);
    cartModel.mockImplementation(() => newCart);

    const res = mockRes();
    await cartController.getCart(mockReq(), res);

    expect(newCart.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        items: [],
        totals: { subtotal: 0, tax: 0, total: 0 },
      })
    );
  });

  test('200 — returns correct totals for multiple items', async () => {
    // p1: 100 × 2 = 200, p2: 200 × 1 = 200 → subtotal 400, tax 40, total 440
    const cart = makeCart([
      { productId: 'p1', quantity: 2 },
      { productId: 'p2', quantity: 1 },
    ]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.getCart(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totals: { subtotal: 400, tax: 40, total: 440 },
      })
    );
  });

  test('200 — unknown productId shows price 0 and lineTotal 0', async () => {
    const cart = makeCart([{ productId: 'p999', quantity: 3 }]);
    cartModel.findOne.mockResolvedValue(cart);

    const res = mockRes();
    await cartController.getCart(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({ productId: 'p999', price: 0, lineTotal: 0 }),
        ]),
      })
    );
  });

  test('500 — DB error returns error message', async () => {
    cartModel.findOne.mockRejectedValue(new Error('DB failure'));

    const res = mockRes();
    await cartController.getCart(mockReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Failed to fetch cart', message: 'DB failure' })
    );
  });
});
