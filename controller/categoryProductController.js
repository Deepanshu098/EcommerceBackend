const categoryModel = require("../model/categoryModel");
const cloudinary = require("../cloudinary/cloudinary");
const productModel = require("../model/productModel");
const reviewModel = require("../model/reviewModel");

exports.addCategory = async(req,res)=>{
    const {categoryName , description} = req.body;
    if(!categoryName || !description){
        res.status(400).json({
            message:'All fields are required!'
        })
    }
    try{
        const existCategory = await categoryModel.findOne({categoryName:categoryName});
        if(existCategory){
            res.status(400).json({
                message:'Category already exists!!'
            })
        }
        else{
            const newCategeory = await categoryModel.create({categoryName,description});
            await newCategeory.save();
            res.status(200).json({
                status:'success',
                message:newCategeory
            })
        }
    }
    catch(err){
        res.status(400).json(err)
    }
}

exports.getCategory = async(req,res)=>{
    try{
        const getAllCategory = await categoryModel.find();
        res.status(200).json(getAllCategory)
    }
    catch(err){
        res.status(400).json(err)
    }
}


//Products

exports.addProduct = async(req,res)=>{
    const {categoryid} = req.query;
    const file = req.file ? req.file?.path : ""
    const {productname,price,discount,quantity,description} = req.body;

    if(!productname || !price || !discount|| !quantity || !description || !file){
        res.status(400).json({
            message:'All fields required!!'
        })
    }
    try{
        const upload = await cloudinary.uploader.upload(file);
        const existingProduct = await productModel.findOne({productname:productname});
        if(existingProduct){
            res.status(400).json({
                error:'Product already exists!!'
            })
        }
        else{
            const newProduct = await productModel.create({productname,price,discount,quantity,description,categoryid,productimage:upload.secure_url});
            await newProduct.save();
            res.status(200).json(newProduct)
        }
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.getProducts = async(req,res)=>{
    const page = req.query?.page || 1;
    const categoryid = req.query.categoryid || "";
    const ITEM_PER_PAGE = 6;

    const query={}

    if(categoryid!="all" && categoryid){
        query.categoryid = categoryid
    }

    try{
        const skip = (page - 1) * ITEM_PER_PAGE;

        //Products count
        const count = await productModel.countDocuments(query);

        const getAllProducts = await productModel.find(query).limit(ITEM_PER_PAGE).skip(skip);

        const pageCount = Math.ceil(count/ITEM_PER_PAGE)
        res.status(200).json({
            data:getAllProducts,
            Pagination:{
                totalProducts:count,pageCount
            }
        })
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.getSingleProduct = async(req,res)=>{
    const {productid} = req.params;
    try{
        const singleProduct = await productModel.findOne({_id:productid});
        res.status(200).json({
            status:'success',
            data:singleProduct
        })
    }
    catch(err){
        res.status(400).json(err)
    }
}

exports.getLatestProducts = async(req,res)=>{
    try{
        const latestProducts = await productModel.find().sort({_id:-1});
        res.status(200).json(latestProducts);
    }
    catch(err){
        res.status(400).json(err);
    }
}

exports.deleteProduct = async(req,res)=>{
    const {productid} = req.params;
    try{
        const deleteProduct = await productModel.findByIdAndDelete({_id:productid})
        res.status(200).json(deleteProduct)
    }
    catch(err){
        res.status(400).json(err)
    }
}

//productreview

exports.productReviews = async(req,res)=>{
    const {productid} = req.params;
    const {username,rating,description} = req.body;
    if(!username || !rating || !description || !productid){
        res.status(400).json({error:"All fields are required"})
    }
    try{
        const productReview = await reviewModel.create({userid:req.userMainId,productid,username,rating,description});
        await productReview.save();

        res.status(200).json(productReview);
    }
    catch(err){
        res.status(400).json(err);
    }
}

//Get Product Reviews

exports.getProductReviews = async(req,res)=>{
    const {productid} = req.params;
    try{
        const getReviews = await reviewModel.find({productid:productid})
        res.status(200).json(getReviews)
    }
    catch(err){
        res.status(400).json(err);
    }
}

//Delete Product Reviews

exports.deleteProductReview = async(req,res)=>{
    const {reviewid} = req.params;
    try{
        const deleteReview = await reviewModel.findByIdAndDelete({_id:reviewid});
        res.status(200).json({
            message:"Review deleted",
            deleteReview
        })
    }
    catch(err){
        res.status(200).json(err);
    }
}