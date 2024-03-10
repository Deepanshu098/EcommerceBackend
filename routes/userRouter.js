const express = require('express');
const { register, userLogin, userVerify, userLogout, forgotPassword, forgotPasswordVerify, resetPassword, getAllUsers, deleteUser, userContact } = require('../controller/userController');
const userupload = require('../middleware/userUpload');
const userAuthenticate = require('../middleware/userAuthenticate');
const adminAuthenticate = require('../middleware/adminAuthenticate');
const userRouter = express.Router();


userRouter.post('/register',userupload.single("userimage"),register)
userRouter.post('/login',userLogin)
userRouter.get('/uservalid',userAuthenticate,userVerify)
userRouter.get('/logout',userAuthenticate,userLogout)
userRouter.post('/forgotpassword',forgotPassword)
userRouter.get('/forgotpassword/:id/:token',forgotPasswordVerify)
userRouter.put('/resetpassword/:id/:token',resetPassword)

userRouter.get('/getallusers',adminAuthenticate,getAllUsers)
userRouter.delete('/userdelete/:userid',adminAuthenticate,deleteUser)


userRouter.post('/usercontact',userAuthenticate,userContact)

module.exports = userRouter;