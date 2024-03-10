const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
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
    mobile:{
        type:String,
        required:true,
        unique:true,
        minLength:10,
        maxLength:10
    },
    image:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{
                type:String
            }
        }
    ]
},{timestamps:true});


// Password hashing
adminSchema.pre('save',async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hashSync(this.password,12);
    }
    next();
})

// Token Generate
adminSchema.methods.generateAuthToken =  async function(req,res){
    try{
        const newtoken = jwt.sign({_id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
        this.tokens = this.tokens.concat({token:newtoken})
        await this.save();
        return newtoken;
    }
    catch(err){
        res.status(400).json({error:err})
    }
}

const adminModel = mongoose.model('Admin',adminSchema);

module.exports = adminModel;