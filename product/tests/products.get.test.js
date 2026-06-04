jest.mock('../src/services/imagekit.service', () => ({
  uploadImage: jest.fn()
}))

jest.mock('../src/middlewares/auth.middleware', () => jest.fn(() => {
  return (req, res, next) => {
    req.user = {
      id: '507f1f77bcf86cd799439011',
      role: 'seller'
    }
    next()
  }
}))

jest.mock('../src/models/product.model', () => ({
  find: jest.fn(),
  findById: jest.fn()
}))

const request = require('supertest')
const app = require('../src/app')
const productModel = require('../src/models/product.model')

describe('GET /api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 and an empty array when there are no products', async () => {
    const query = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([])
    }
    productModel.find.mockReturnValue(query)

    const response = await request(app).get('/api/products')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ data: [] })
    expect(productModel.find).toHaveBeenCalledWith({})
    expect(query.skip).toHaveBeenCalledWith(0)
    expect(query.limit).toHaveBeenCalledWith(20)
  })

  it('applies text search and pagination when query params are provided', async () => {
    const products = [
      {
        _id: '648f1f77bcf86cd799439011',
        title: 'Search Product',
        description: 'Found by query',
        price: { amount: 150, currency: 'INR' },
        seller: '507f1f77bcf86cd799439011',
        images: []
      }
    ]

    const query = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(products)
    }
    productModel.find.mockReturnValue(query)

    const response = await request(app)
      .get('/api/products')
      .query({ q: 'Search', skip: '5', limit: '10' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ data: products })
    expect(productModel.find).toHaveBeenCalledWith({ $text: { $search: 'Search' } })
    expect(query.skip).toHaveBeenCalledWith(5)
    expect(query.limit).toHaveBeenCalledWith(10)
  })
})

describe('GET /api/products/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 and the product when the product exists', async () => {
    const product = {
      _id: '648f1f77bcf86cd799439011',
      title: 'Single Product',
      description: 'A single product',
      price: { amount: 120, currency: 'INR' },
      seller: '507f1f77bcf86cd799439011',
      images: []
    }

    productModel.findById.mockResolvedValue(product)

    const response = await request(app).get('/api/products/648f1f77bcf86cd799439011')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ product })
    expect(productModel.findById).toHaveBeenCalledWith('648f1f77bcf86cd799439011')
  })

  it('returns 404 when the product is not found', async () => {
    productModel.findById.mockResolvedValue(null)

    const response = await request(app).get('/api/products/648f1f77bcf86cd799439011')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ message: 'Product not found' })
    expect(productModel.findById).toHaveBeenCalledWith('648f1f77bcf86cd799439011')
  })
})

describe('GET /api/products/seller', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns 200 and products for the authenticated seller', async () => {

    const sellerProducts = [
      {
        _id: '648f1f77bcf86cd799439011',
        title: 'Seller Product 1',
        description: 'Owned by seller',
        price: {
          amount: 100,
          currency: 'INR'
        },
        seller: '507f1f77bcf86cd799439011',
        images: []
      }
    ]

    const query = {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(sellerProducts)
    }

    productModel.find.mockReturnValue(query)

    const response = await request(app)
      .get('/api/products/seller')

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      data: sellerProducts
    })

    expect(productModel.find).toHaveBeenCalledWith({
      seller: '507f1f77bcf86cd799439011'
    })

    expect(query.skip).toHaveBeenCalledWith(0)

    expect(query.limit).toHaveBeenCalledWith(20)
  })
})
