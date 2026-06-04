const mongoose = require('mongoose')


async function connectDB(){
    try {
       await mongoose.connect(process.env.MONGO_URI) 
       console.log("mongoDB is connected")
    } catch (error) {
        console.error("Mongodb is disconnected", error)
    }
}

module.exports =  connectDB