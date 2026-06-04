const express = require('express');
const cors = require('cors'); // Ensure you have installed this: npm install cors
const cookieParser = require('cookie-parser');
const cartRoutes = require('./routes/cart.routes');

const app = express();


app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true               
}));

app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=> {
  res.status(200).json({
    message:"Cart service is running"
  })
})

app.use('/api/cart', cartRoutes);

module.exports = app;