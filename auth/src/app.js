const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express()
app.use(cors({
  origin: 'http://localhost:5173', // Aapke React development server ka port
  credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=> {
  res.status(200).json({
    message:"Auth service is running"
  })
})

// Routes
app.use('/api/auth', authRoutes);

module.exports = app;