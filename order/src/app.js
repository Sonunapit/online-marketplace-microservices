
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const orderRoutes = require('./routes/order.routes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://online-marketplace-microservices.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With'
  ]
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Order service is running'
  });
});

app.use('/api/orders', orderRoutes);

module.exports = app;
