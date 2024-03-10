const OrderModel = require("../model/orderModel");
const momemt=require('moment');
const userModel = require("../model/userModel");
const { orderConfirmationTemplate } = require("../helper");
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.GMAIL,
        pass:process.env.PASSWORD
    }
})

//Add User Order
exports.addOrder=async(req,res)=>{
    const { address, city, pincode, mobile, state, country, orderItems, paymentdetails, itemsPrice, shippingPrice, totalPrice } = req.body;

    const deliverydate = momemt().add(2, 'days').format('YYYY-MM-DD');

    try{
        const createOrder = await OrderModel.create({userid:req.userId,
            address,city,pincode,mobile,state,country,orderItems,paymentdetails,itemsPrice,shippingPrice,totalPrice,deliveredAt:deliverydate
        })
        await createOrder.save();
        res.status(200).json(createOrder);
    }
    catch(err){
        res.status(400).json(err);
    }
}

//Get Order -- User
exports.getUserOrders = async(req,res)=>{
    try{
        const getuserOrders = await OrderModel.find({userid:req.userId}).sort({_id:-1})
        res.status(200).json(getuserOrders)
        // console.log(getuserOrders)
    }
    catch(err){
        res.status(400).json(err)
    }
}

//Get All Orders - admin
exports.getAllOrders = async(req,res)=>{
    try{
        const getallorders = await OrderModel.find().sort({_id:-1})
        res.status(200).json(getallorders)
    }
    catch(err){
        res.status(400).json(err)
    }
}

//update Order Status
exports.updateOrderStatus = async(req,res)=>{
    const {orderid} = req.params;
    const {orderStatus} = req.body;
    // console.log(orderid,orderstatus)

    const findorderdetails = await OrderModel.findOne({_id:orderid});
    const userdetails = await userModel.findOne({_id:findorderdetails.userid})
    console.log("uu",userdetails)


    if(findorderdetails.orderstatus == "Processing" && orderStatus == "Confirmed"){
        const updateOrder = await OrderModel.findByIdAndUpdate({_id:orderid},{orderstatus : orderStatus},{new:true})
        await updateOrder.save();


        //send invoice for order confirmation
        const mailOptions = {
            from:process.env.GMAIL,
            to:userdetails.email,
            subject:"Sending mail for Order Confirmation",
            html:orderConfirmationTemplate(findorderdetails,userdetails)
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

        res.status(200).json(updateOrder)
    }
    else if(findorderdetails.orderstatus == "Confirmed" && orderStatus == "Shipped"){
        const updateOrder = await OrderModel.findByIdAndUpdate({_id:orderid},{orderstatus : orderStatus},{new:true})
        await updateOrder.save();
        res.status(200).json(updateOrder)
    }
    else if(findorderdetails.orderstatus == "Shipped" && orderStatus == "Delivered"){
        const updateOrder = await OrderModel.findByIdAndUpdate({_id:orderid},{orderstatus : orderStatus},{new:true})
        await updateOrder.save();
        res.status(200).json(updateOrder)
    }
    else{
        res.status(400).json({error:"invalid status"});
    }

}