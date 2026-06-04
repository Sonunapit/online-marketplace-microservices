const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB is connected Successfuly")
    } catch (error) {
        console.log("MongoDB is disconnected",error)
    }
}

module.exports = connectDB