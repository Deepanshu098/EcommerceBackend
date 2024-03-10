const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");

exports.addtoCart = async(req,res)=>{
    const {id} = req.params;
    try{
        const productfind = await productModel.findOne({_id:id})
        // console.log(productfind)      
        const carts = await cartModel.findOne({userid:req.userId,productid:productfind._id});
        // console.log(carts) 
        
        if(productfind?.quantity){
            if(carts?.quantity >= 1){
                //Add to cart
                carts.quantity = carts.quantity + 1;
                await carts.save();

                //Product decrement quantity
                productfind.quantity = productfind.quantity - 1;
                await productfind.save();

                res.status(200).json({
                    message:"Product successfully increased to your cart"
                })
            }else{
                const addToCart = new cartModel({
                    userid:req.userId,
                    productid:productfind._id,
                    quantity:1
                })
            await addToCart.save();

            productfind.quantity = productfind.quantity - 1;
            await productfind.save();

            res.status(200).json({
                message:"Product successfully added to the Cart!!"
            })    
            }
        }
        else{
            res.status(400).json({error:"The Product is sold out"});
        }
    }
    catch(err){
        res.status(400).json(err);
    }
}


//get Carts Value

exports.getCarts = async(req,res)=>{
    try{
        const getCarts = await cartModel.aggregate([
            {
                $match:{userid:req.userMainId}
            },
            {
                $lookup:{
                    from:"products",
                    localField:"productid",
                    foreignField:"_id",
                    as:"productDetails"
                }
            },

            //Getting first data from product details array
            {
                $project:{
                    _id:1,
                    userid:1,
                    productid:1,
                    quantity:1,
                    productDetails:{$arrayElemAt : ['$productDetails',0]}//Extract first element of product array
                }
            }
        ])
        res.status(200).json(getCarts);
    }
    catch(err){
        res.status(400).json(err)
    }
}

//Remove Single Item

exports.removeSingleItem = async(req,res)=>{
    const {id} = req.params;
    try{
        const productfind = await productModel.findOne({_id:id});

        const carts = await cartModel.findOne({userid:req.userId,productid:productfind._id})

        if(!carts){
            res.status(400).json({error:"Cart Item is not found!!"})
        }

        // console.log(carts)
        if(carts.quantity == 1){
            const deleteCartItem = await cartModel.findByIdAndDelete({_id:carts._id})

            //Increment product quantity
            productfind.quantity = productfind.quantity + 1;
            await productfind.save();

            res.status(200).json({
                message:"Your Item successfully removed from the cart",
                deleteCartItem
            })
        }
        else if(carts.quantity > 1){
            carts.quantity = carts.quantity - 1;
            await carts.save();

            //Incrememnt product quantity
            productfind.quantity = productfind.quantity + 1;
            await productfind.save();

            res.status(200).json({message:"Your Item successfully decrement from your cart"})
        }

    }
    catch(err){
        res.status(400).json(err);
    }
}

//Remove Items

exports.removeItems = async(req,res)=>{
    const {id} = req.params;
    try{
        const productfind = await productModel.findOne({_id:id});
        const carts = await cartModel.findOne({userid:req.userId,productid:productfind._id});
        if(!carts){
            res.status(400).json({error:"Cart Item not found"})
        }

        const deletecartItem = await cartModel.findByIdAndDelete({_id:carts._id});
        productfind.quantity = productfind.quantity + 1;
        await productfind.save();
        res.status(200).json({
            message:"Your Item successfully removed from the cart",
            deletecartItem
        })
    }
    catch(err){
        res.status(400).json(err);
    }
}

//Delete carts data

exports.deleteCartData = async(req,res)=>{
    try{
        const deleteCarts = await cartModel.deleteMany({userid:req.userId})
        res.status(200).json(deleteCarts)
    }
    catch(err){
        res.status(400).json(err);
    }
}