const mongoose = require('mongoose')

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB is connected ")
    } catch (error) {
        console.error("MongoDB is disconnected ", error)
    }
}

module.exports = connectDB
