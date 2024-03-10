const express = require('express');
const adminAuthenticate = require('../middleware/adminAuthenticate');
const { addCategory, getCategory } = require('../controller/categoryProductController');
const categoryRouter = express.Router();

//Category Routes
categoryRouter.post('/addcategory',adminAuthenticate,addCategory);
categoryRouter.get('/getcategory',getCategory)



module.exports = categoryRouter;