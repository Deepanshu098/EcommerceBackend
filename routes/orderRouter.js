const express = require('express');
const userAuthenticate = require('../middleware/userAuthenticate');
const adminAuthenticate = require('../middleware/adminAuthenticate');
const { addOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controller/orderController');
const orderRouter = express.Router();

//Order Routes
//FOr user
orderRouter.post('/addorders',userAuthenticate,addOrder)
orderRouter.get('/getuserorders',userAuthenticate,getUserOrders)

//for Admin
orderRouter.get('/orders',adminAuthenticate,getAllOrders)
orderRouter.put('/orders/:orderid',adminAuthenticate,updateOrderStatus)



module.exports = orderRouter;