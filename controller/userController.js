const userModel = require("../model/userModel");
const cloudinary = require("../cloudinary/cloudinary")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path');
const fs = require('fs');
// const {transporter} = require('../helper.js')
const ejs = require('ejs')
const nodemailer = require('nodemailer');
const contactModel = require("../model/userContactModel");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.GMAIL,
        pass:process.env.PASSWORD
    }
})


exports.register = async(req,res)=>{
    const {firstName,lastName,email,password,confirmPassword} = req.body;
        if(!firstName || !lastName || !email || !password || !confirmPassword || !req.file){
            res.status(400).json({
                status:'failed',
                message:'All fields are required!!'
            })
        }

        const file = req.file?.path;
        const upload = await cloudinary.uploader.upload(file);

        try{
            const userExist = await userModel.findOne({email:email})
            if(userExist){
                res.status(400).json({
                    status:'failed',
                    message:'The User already exists!!'
                })
            }

            else if(password != confirmPassword){
                res.status(400).json({
                    status:'failed',
                    message:'Password and Confirm Password should match'
                })
            }
            else{
                const user = await userModel.create({firstName,lastName,email,password,userimage:upload.secure_url})
                await user.save();
                res.status(200).json({
                status:'success',
                data:user
            })
            }
        }
    catch(err){
            res.status(400).json(err)
    }
}

exports.userLogin = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400).json({
            status:'failed',
            message:'All fields are mandatory!!'
        })
    }
    try{
        const User = await userModel.findOne({email:email})
        if(User){
            const isMatch = await bcrypt.compareSync(password,User.password);
            // console.log("Match",password,User.password)
            if(!isMatch){
                    res.status(200).json({
                        status:'failed',
                        message:"Invalid details"
                    }) 
            }
            else{
                const token = await User.generateUserToken();
                const result = {User , token};
                res.status(200).json({
                    status:'success',
                    data:result
                })
            }
        }
        else{
            res.status(400).json({
                status:'failed',
                message:'Incorrect credentials!!'
            })
        }
    }
    catch(err){
        res.status(400).json({
            status:'failed',
            error:err.message
        })
    }
}

exports.userVerify = async(req,res)=>{
    try{
        const verifyUser = await userModel.findOne({_id:req.userId});
        res.status(200).json({
            status:'success',
            message:verifyUser
        })
    }
    catch(err){
        res.status(400).json({
            status:'failed',
            message:'Invalid details'
        })
    }
}

exports.userLogout = async(req,res)=>{
    try{
        req.rootUser.tokens = req.rootUser.tokens.filter((currentElement)=>{
            return currentElement.token != req.token;
        }) 
        req.rootUser.save();
        res.status(200).json({
            message:'User successfully logout!!'
        })
    }
    catch(err){
        res.status(400).json(err)
    }
}

exports.forgotPassword = async(req,res)=>{
    const {email} = req.body;
    if(!email){
        res.status(400).json({
            message:"Email not found!!"
        })
    }
    try{
        const userFind = await userModel.findOne({email:email});
        // console.log(userFind)
        if(userFind){
            // token generate for password change
            const token = jwt.sign({_id:userFind._id},process.env.JWT_SECRET_KEY,{expiresIn:"120s"});

            const setusertoken = await userModel.findByIdAndUpdate({_id:userFind._id},{verifytoken:token},{new:true});
            // console.log(setusertoken.verifytoken)

            //Join email path
            const emailTemplatePath = path.join(__dirname,"../EmailTemplate/ForgotTemplate.ejs");
            const emailTemplateRead = fs.readFileSync(emailTemplatePath,"utf-8");
            // console.log(emailTemplatePath,emailTemplateRead)

            // Set token and logo to ejs file
            const data = {
                passwordresetlink:`http://localhost:3000/resetpassword/${userFind.id}/${setusertoken.verifytoken}`,
                logo:"https://cdn-icons-png.flaticon.com/128/732/732200.png"
            }

            //set dynamic value in ejs
            const renderTemplate = ejs.render(emailTemplateRead,data);

            
            if(setusertoken){
                const mailOptions = {
                    from:process.env.GMAIL,
                    to:email,
                    subject:"Sending mail for Password Reset",
                    html:renderTemplate
                }
                
                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        res.status(400).json({error:"Email not send"})
                    }
                    else{
                        console.log(data.passwordresetlink)
                        res.status(200).json({message:"Email sent successfully"})
                    }
                })
            }
        }
        else{
            res.status(400).json("Email not exists!!")
        }
    }
    catch(err){
            res.status(400).json(err)
    }
}

exports.forgotPasswordVerify = async(req,res)=>{
    const {id,token} = req.params;
    try{
        const userverify = await userModel.findOne({_id:id,verifytoken:token})

        const verifytoken = jwt.verify(token,process.env.JWT_SECRET_KEY)
        
        if(userverify && verifytoken._id){
            res.status(200).json("User Valid")
        }
        else{
            res.status(400).json("User not exist")
        }
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.resetPassword = async(req,res)=>{
    const {id , token} = req.params;
    const {password} = req.body;
    try{
        const userverify = await userModel.findOne({_id:id,verifytoken:token})

        const verifytoken = jwt.verify(token,process.env.JWT_SECRET_KEY)
        
        if(userverify && verifytoken._id){
            const newPassword = await bcrypt.hashSync(password,12);
            const setNewPassword = await userModel.findByIdAndUpdate({_id:id},{password:newPassword},{new:true})
            await setNewPassword.save();
            res.status(200).json({message:"Password successfully updated!!"})

        }
        else{
            res.status(400).json({error:"Session time out please geneate new Link"})
        }
    }
    catch(err){
        res.status(400).json(err)
    }
}


exports.getAllUsers= async(req,res)=>{
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 4;
    try{
        const skip = (page - 1)*ITEM_PER_PAGE;

        const count = await userModel.countDocuments();

        const pagecount = Math.ceil(count/ITEM_PER_PAGE)

        const Users = await userModel.
        find().
        limit(ITEM_PER_PAGE).
        skip(skip).
        sort({_id:-1})

        res.status(200).json({
            Pagination:{
                count,pagecount
            },
            Users
        })

    }
    catch(err){
        res.status(400).json(err)
    }
}

exports.deleteUser = async(req,res)=>{
    const {userid} = req.params;
    try{
        const deleteUser = await userModel.findByIdAndDelete({_id:userid});
        res.status(200).json({
            message:"User deleted successfully!!"
        })
    }
    catch(err){
        res.status(400).json(err)
    }
}

exports.userContact = async(req,res)=>{
    const {name,email,message} = req.body;
    if(!name || !email || !message){
        res.status(400).json({error:"All fields are required"})
    }
    try{
        const userContact = await contactModel.create({name,email,message});
        res.status(200).json(userContact);
    }
    catch(err){
        res.status(400).json(err);
    }
}