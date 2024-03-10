const jwt = require('jsonwebtoken');
const adminModel = require('../model/adminModel');

const adminAuthenticate = async(req,res,next)=>{
    try{
        const token = req.headers.authorization;
        const verifyToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
        console.log("ver",verifyToken)
        const rootUser = await adminModel.findOne({_id:verifyToken._id})
        if(!rootUser){
             throw new Error("User not found!!")
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id
        next();
    }
    catch(err){
        res.status(400).json({
            error:'Unauthorize no token provided!!'
        })
    }
}

module.exports = adminAuthenticate;