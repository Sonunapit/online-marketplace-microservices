jest.mock('../src/middlewares/auth.middleware', () => {
  return jest.fn(() => {
    return (req, res, next) => {

      req.user = {
        id: '507f1f77bcf86cd799439011',
        role: 'seller'
      }

      next()
    }
  })
})

jest.mock('imagekit', () => {
  return jest.fn().mockImplementation(() => ({
    upload: jest.fn().mockResolvedValue({
      url: 'https://test.example.com/image.png',
      thumbnailUrl: 'https://test.example.com/image-thumb.png',
      fileId: 'test-file-id'
    })
  }))
})

jest.mock('../src/models/product.model', () => ({
  create: jest.fn().mockResolvedValue({
    title: 'Test Product',
    description: 'A sample product',
    price: {
      amount: 299,
      currency: 'USD'
    },
    seller: '507f1f77bcf86cd799439011',
    images: [
      {
        url: 'https://test.example.com/image.png',
        thumbnail: 'https://test.example.com/image-thumb.png',
        id: 'test-file-id'
      }
    ]
  })
}))

const request = require('supertest')
const app = require('../src/app')

describe('POST /api/products', () => {

  it('should upload an image and create a product', async () => {

    const response = await request(app)
      .post('/api/products')
      .field('title', 'Test Product')
      .field('description', 'A sample product')
      .field('priceAmount', '299')
      .field('priceCurrency', 'USD')
      .attach('images', Buffer.from('fake-image-content'), 'sample.png')

    console.log(response.body)

    expect(response.status).toBe(201)

    expect(response.body.data).toMatchObject({
      title: 'Test Product',
      description: 'A sample product',
      price: { amount: 299, currency: 'USD' },
      seller: '507f1f77bcf86cd799439011',
      images: [
        {
          url: 'https://test.example.com/image.png',
          thumbnail: 'https://test.example.com/image-thumb.png',
          id: 'test-file-id'
        }
      ]
    })
  })
})