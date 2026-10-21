
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cartRoutes = require('./routes/cart.routes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://online-marketplace-microservices-frontend.onrender.com'
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
    message: 'Cart service is running'
  });
});

app.use('/api/cart', cartRoutes);

module.exports = app;
