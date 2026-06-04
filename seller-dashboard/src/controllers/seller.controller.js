const userModel = require("../models/user.model")
const productModel = require("../models/product.model")
const orderModel = require("../models/order.model")
const paymentModel = require("../models/payment.model")

// GET /seller/dashboard/metrics - Sales, revenue, top products
async function getMetrics(req, res) {
    try {
        const sellerId = req.user.id

        // Get seller's products
        const sellerProducts = await productModel.find({ seller: sellerId }).select('_id')
        const productIds = sellerProducts.map(p => p._id)

        // Get sales count and revenue
        const metricsData = await orderModel.aggregate([
            {
                $match: {
                    'items.product': { $in: productIds },
                    status: { $in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: 1 },
                    totalRevenue: { $sum: '$totalPrice.amount' },
                    currencyCode: { $first: '$totalPrice.currency' }
                }
            }
        ])

        // Get top products by quantity sold
        const topProducts = await orderModel.aggregate([
            {
                $match: {
                    'items.product': { $in: productIds },
                    status: { $in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] }
                }
            },
            { $unwind: '$items' },
            {
                $match: { 'items.product': { $in: productIds } }
            },
            {
                $group: {
                    _id: '$items.product',
                    totalQuantitySold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price.amount'] } }
                }
            },
            { $sort: { totalQuantitySold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    _id: 1,
                    productName: '$productDetails.title',
                    totalQuantitySold: 1,
                    totalRevenue: 1
                }
            }
        ])

        const metrics = metricsData.length > 0 ? metricsData[0] : {
            totalSales: 0,
            totalRevenue: 0,
            currencyCode: 'INR'
        }

        return res.status(200).json({
            success: true,
            data: {
                sales: metrics.totalSales || 0,
                revenue: {
                    amount: metrics.totalRevenue || 0,
                    currency: metrics.currencyCode || 'INR'
                },
                topProducts: topProducts || []
            }
        })
    } catch (error) {
        console.error("Error fetching metrics:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// GET /seller/dashboard/orders - Seller's orders
async function getOrders(req, res) {
    try {
        const sellerId = req.user.id

        // Get seller's products
        const sellerProducts = await productModel.find({ seller: sellerId }).select('_id')
        const productIds = sellerProducts.map(p => p._id)

        // Get orders containing seller's products
        const orders = await orderModel.aggregate([
            {
                $match: {
                    'items.product': { $in: productIds }
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    orderId: '$_id',
                    customerName: { $ifNull: ['$userDetails.name', 'Unknown'] },
                    customerEmail: { $ifNull: ['$userDetails.email', 'N/A'] },
                    items: 1,
                    status: 1,
                    totalPrice: 1,
                    shippingAddress: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ])

        return res.status(200).json({
            success: true,
            data: {
                total: orders.length,
                orders: orders
            }
        })
    } catch (error) {
        console.error("Error fetching orders:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// GET /seller/dashboard/products - Seller's product inventory & low stock alerts
async function getProducts(req, res) {
    try {
        const sellerId = req.user.id
        const lowStockThreshold = 10 // Products with stock <= 10 are considered low stock

        // Get all seller's products
        const products = await productModel.find({ seller: sellerId })

        // Separate products into low stock and normal stock
        const lowStockProducts = products.filter(p => p.stock <= lowStockThreshold)
        const normalStockProducts = products.filter(p => p.stock > lowStockThreshold)

        // Get sales count for each product
        const productSalesData = await orderModel.aggregate([
            {
                $match: {
                    'items.product': { $in: products.map(p => p._id) },
                    status: { $in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalUnitsSold: { $sum: '$items.quantity' }
                }
            }
        ])

        const salesMap = {}
        productSalesData.forEach(item => {
            salesMap[item._id.toString()] = item.totalUnitsSold
        })

        const formatProduct = (product) => ({
            _id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            stock: product.stock,
            images: product.images || [],
            unitsSold: salesMap[product._id.toString()] || 0
        })

        return res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalProducts: products.length,
                    lowStockCount: lowStockProducts.length,
                    normalStockCount: normalStockProducts.length
                },
                lowStockAlerts: lowStockProducts.map(formatProduct),
                inventory: normalStockProducts.map(formatProduct)
            }
        })
    } catch (error) {
        console.error("Error fetching products:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports = {
    getMetrics,
    getOrders,
    getProducts
}