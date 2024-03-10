const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true});


const categoryModel = mongoose.model('Category',categorySchema);

module.exports = categoryModel;