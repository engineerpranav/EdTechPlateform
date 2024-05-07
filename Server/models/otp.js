
const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailsender");

const otpSchema = new mongoose.Schema({

    email: {
        type: String,
        required:true
    },
    otp:{
        type:Number,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }


});

async function sendVerificationEmail(email,otp){

    try{
        console.log(email,otp)
        const mailResponse=await mailSender(email,"Verification Mail From StudyTech",otp);
        console.log("email send",mailResponse);

    }
    catch(err){
        console.log("error found while sending email");
        throw err;
    }

}

otpSchema.pre("save",async function(next){

    await sendVerificationEmail(this.email,this.otp);
     next();
})

module.exports=mongoose.model("Otp",otpSchema);
module.exports={sendVerificationEmail}
