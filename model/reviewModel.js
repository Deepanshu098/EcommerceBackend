const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    productid:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    rating:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true});

const reviewModel = mongoose.model('productreview',reviewSchema);
module.exports = reviewModel;