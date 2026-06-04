require('dotenv').config()
const app = require('./src/app.js')
const connectDB = require("./src/db/db.js")
const listener = require('./src/broker/listener.js')

const { connect } = require('./src/broker/broker.js')



connectDB()
connect().then(() => {
    listener()
})

app.listen(3007,()=>{
    console.log("Seller-dashboard server is running on port 3007")
})