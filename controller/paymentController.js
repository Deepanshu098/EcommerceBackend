const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

//payment controller
exports.processPayment= async(req,res)=>{
    const {totalamount} = req.body;
    // console.log(req.body)
    
    try{
        const mypayment = await stripe.paymentIntents.create({
            amount:totalamount,
            currency:"inr",
            metadata:{
                company:"Ecommerce"
            },
            description:"Project"
        })
        // console.log("Payment",mypayment)
        res.status(200).json(mypayment.client_secret)
    }
    catch(err){
        res.status(400).json(err)
    }
}