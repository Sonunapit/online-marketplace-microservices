
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://online-marketplace-microservices-frontend.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Auth service is running'
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

module.exports = app;
