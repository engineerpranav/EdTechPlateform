const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();

exports.connect=()=>{

    mongoose.connect(process.env.MONGODB_URL    ,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("database connected")
    }).catch((err)=>{
        console.error(err);
        process.exit(1)
    
    })
}


