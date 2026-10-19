
const crypto = require('crypto')
global.crypto = crypto
const mongoose = require('mongoose')

async function connectDB() {
  try {
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI)

    await mongoose.connect(process.env.MONGO_URI)

    console.log("✅ MongoDB is connected")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
  }
}

module.exports = connectDB