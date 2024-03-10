const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

const userAuthenticate = async(req,res,next)=>{
    try{
        const token = req.headers.authorization;
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
        // console.log("ver",verifyToken)
        const rootUser = await userModel.findOne({_id:verifyToken._id})
        if(!rootUser){
             throw new Error("User not found!!")
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id
        req.userMainId = rootUser.id
        next();
    }
    catch(err){
        res.status(400).json({
            message:'Unauthorize no token provided!!'
        })
    }
}

module.exports = userAuthenticate;