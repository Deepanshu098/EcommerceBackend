require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const adminRouter = require('./routes/adminAuthRouter');
const categoryRouter = require('./routes/catgeoryRouter');
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const cartRouter = require('./routes/cartRouter');
const orderRouter = require('./routes/orderRouter');
const paymentRouter = require('./routes/paymentRouter');

require('./db/connection')

app.use(cors());
app.use(express.json());

app.use('/admin/auth',adminRouter);
app.use('/category/api',categoryRouter);
app.use('/product/api',productRouter);
app.use('/user/auth',userRouter)
app.use('/user/cart',cartRouter)
app.use('/orders/api',orderRouter)
app.use('/checkout/api',paymentRouter)



module.exports = app;

