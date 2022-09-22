const express = require ('express')
const app = express()
const cookieParser = require ('cookie-parser')

const ErrorHandler = require('../backend/middleware/error')



app.use(express.json())

app.use(cookieParser())

const product = require('./routes/ProductRoute')
const user = require('./routes/UserRoute')
const order = require('./routes/OrderRoute')
const cart = require('./routes/CartRoute')



app.use('/api/v2', product);
app.use('/api/v2', user);
app.use('/api/v2', order);
app.use('/api/v2', cart);
app.use(ErrorHandler);



module.exports= app