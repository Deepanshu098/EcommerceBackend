const multer = require('multer');

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./userUploads")
    },
    filename:(req,file,callback)=>{
        const filename = `image-${Date.now()}.${file.originalname}`
        callback(null,filename)
    }
});

//Filter
const filefilter = (req,file,callback)=>{
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        callback(null,true)
    }else{
        callback(null,false)
        return callback(new Error("Only png, jpg, jpeg format allowed"))
    }
}

const userupload = multer({
    storage:storage,
    fileFilter:filefilter
});

module.exports = userupload;