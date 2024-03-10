const express = require('express');
const userAuthenticate = require('../middleware/userAuthenticate');
const { addtoCart, getCarts, removeSingleItem, removeItems, deleteCartData } = require('../controller/cartController');
const cartRouter = express.Router();

cartRouter.post('/addtocart/:id',userAuthenticate,addtoCart)
cartRouter.get('/getcarts',userAuthenticate,getCarts)
cartRouter.delete('/removesingleitem/:id',userAuthenticate,removeSingleItem)
cartRouter.delete('/removeitems/:id',userAuthenticate,removeItems)

//Remove cart data when order done
cartRouter.delete('/removecartdata',userAuthenticate,deleteCartData)


module.exports = cartRouter;