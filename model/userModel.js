const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    userimage:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String
            }
        }
    ],
    verifytoken:{
        type:String
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hashSync(this.password,12)
    }
    next();
})

//Token Generate 
userSchema.methods.generateUserToken = async function(){
    try{
        const newtoken = jwt.sign({_id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"});
        this.tokens = this.tokens.concat({token:newtoken});  // [{token:fdgfhjghfgh]}
        await this.save();
        return newtoken;
    }
    catch(err){
        res.status(400).json(err);
    }
}

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;