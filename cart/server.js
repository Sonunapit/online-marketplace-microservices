require('dotenv').config()
const app = require('./src/app.js')
const connectDB = require('./src/db/db.js')


connectDB()


app.listen(3002, ()=> {
    console.log('Cart Server is runing on port 3002')
})