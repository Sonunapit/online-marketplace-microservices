const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const paymentRoutes = require("./routes/payment.routes");

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173", // React/Vite Frontend
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());


app.get("/",(req,res)=> {
  res.status(200).json({
    message:"Payment service is running"
  })
})

app.use(
  "/api/payments",
  paymentRoutes
);

module.exports = app;