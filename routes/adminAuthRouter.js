const express = require('express');
const { signup, login, adminVerify, logout } = require('../controller/adminAuthController');
const upload = require('../middleware/adminUpload');
const adminAuthenticate = require('../middleware/adminAuthenticate');
const adminRouter = express.Router();


adminRouter.post('/signup',upload.single('admin_profile'),signup)
adminRouter.post('/login',login)
adminRouter.get('/adminverify',adminAuthenticate,adminVerify)
adminRouter.get('/logout',adminAuthenticate,logout)



module.exports = adminRouter;