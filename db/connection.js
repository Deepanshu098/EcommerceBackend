const mongoose = require('mongoose');

const DB = process.env.MONGO_DB;

mongoose.connect(DB).then(()=>{
    console.log('Database connected')
}).catch((err)=>{
    console.log('Error',err)
})