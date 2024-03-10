const express = require('express');
const userAuthenticate = require('../middleware/userAuthenticate');
const { processPayment } = require('../controller/paymentController');
const paymentRouter = express.Router();



paymentRouter.post('/payment',userAuthenticate,processPayment)


module.exports = paymentRouter;