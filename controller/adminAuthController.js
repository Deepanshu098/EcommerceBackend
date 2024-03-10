const cloudinary = require("../cloudinary/cloudinary");
const adminModel = require("../model/adminModel");
const bcrypt = require('bcryptjs');

exports.signup = async (req,res)=>{
        const {name , email , password ,confirmpassword , mobile} = req.body;
        if(!name || !email || !password || !mobile || !req.file){
            res.status(400).json({
                status:'failed',
                message:'All fields are mandatory!!'
            })
        }

        const file = req.file?.path;
        const upload = await cloudinary.uploader.upload(file)

        try{
            const userExist = await adminModel.findOne({email:email})
            const mobileVerification = await adminModel.findOne({mobile:mobile})
            if(userExist){
                res.status(400).json({
                    status:'failed',
                    message:'The admin alreasy exists!!'
                })
            }
            else if(mobileVerification){
                res.status(400).json({
                    status:'failed',
                    message:'The mobile no already exists!!'
                })
            }
            else if(password != confirmpassword){
                res.status(400).json({
                    status:'failed',
                    message:'Password and Confirm Password should match'
                })
            }
            else{
                const user = await adminModel.create({name,email,mobile,password,image:upload.secure_url})
                await user.save();
                res.status(200).json({
                status:'success',
                data:user
            })
            }
        }
        catch(err){
             res.status(500).json({
                    status:'failed',
                    message:"error"
                })
        }
}

exports.login = async(req,res)=>{
    const{email,password} = req.body;

    if(!email || !password){
        res.status(400).json({
            status:'failed',
            message:'All fields are mandatory!!'
        })
    }

    try{
        const adminValid = await adminModel.findOne({email:email});
        if(adminValid){
            const isMatch = await bcrypt.compareSync(password,adminValid.password);
            if(!isMatch){
                res.status(400).json({
                    status:'failed',
                    message:'Invalid details!!'
                })
            }
            else{
                const token = await adminValid.generateAuthToken();
                const result = {adminValid,token};
                res.status(200).json({
                    status:'success',
                    data:result
                })
            }
        }
        else{
            res.status(400).json({
                status:'failed',
                message:'Invalid details'
            })
        }
    }
    catch(err){

    }
}


exports.adminVerify = async(req,res)=>{
    try{
        const verifyAdmin = await adminModel.findOne({_id:req.userId});
        res.status(200).json({
            status:'success',
            message:verifyAdmin
        })
    }
    catch(err){
        res.status(400).json({
            status:'failed',
            message:'Invalid details!!'
        })
    }
}

exports.logout = async(req,res)=>{
    try{
        req.rootUser.tokens = req.rootUser.tokens.filter((currentElement)=>{
            return currentElement.token != req.token
        })
        req.rootUser.save();
        res.status(200).json({
            message:"User successfully logout"
        })
    }
    catch(err){
        res.status(400).json(err);
    }
}