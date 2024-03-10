const express = require('express');
const adminAuthenticate = require('../middleware/adminAuthenticate');
const productupload = require('../middleware/productUpload');
const { addProduct, getProducts, getSingleProduct, getLatestProducts, deleteProduct, productReviews, getProductReviews, deleteProductReview } = require('../controller/categoryProductController');
const productRouter = express.Router();
const userAuthenticate = require('../middleware/userAuthenticate')

productRouter.post('/addproduct',[adminAuthenticate,productupload.single("productimage")],addProduct);
productRouter.get('/getproducts',getProducts)
productRouter.get('/singleproduct/:productid',getSingleProduct)
productRouter.delete('/product/:productid',deleteProduct)


//Get Latest Products
productRouter.get('/getlatestproducts',getLatestProducts)

//Reviews
productRouter.post('/productreview/:productid',userAuthenticate,productReviews)
productRouter.get('/getproductreview/:productid',getProductReviews)
productRouter.delete('/deleteproductreview/:reviewid',userAuthenticate,deleteProductReview)

module.exports = productRouter;