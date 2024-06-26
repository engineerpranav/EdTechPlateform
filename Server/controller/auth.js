const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { mailSender } = require("../utils/mailsender");
require("dotenv").config();



//sendOTP
exports.sendOTP = async (req, res) =>  {

    try {
        const {email} = req.body;

        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent) {
            return res.status(401).json({
                success:false,
                message:'User already registered',
            })
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated: ", otp );

        //check unique otp or not
        let result = await OTP.findOne({otp: otp});

        while(result) {
            otp = otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:'OTP Sent Successfully',
            otp,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }


};

//signUp
exports.signUp = async (req, res) => {
    try {

        const {
            firstName,
            lastName, 
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber, 
            otp
        } = req.body;
    
        if(!firstName || !lastName || !email || !password || !confirmPassword
            || !otp) {
                return res.status(403).json({
                    success:false,
                    message:"All fields are required",
                })
        }


        if(password !== confirmPassword) {
            return res.status(400).json({
                success:false,
                message:'Password and ConfirmPassword Value does not match, please try again',
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success:false,
                message:'User is already registered',
            });
        }

        //find most recent OTP stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        if(recentOtp.length == 0) {
         
            return res.status(400).json({
                success:false,
                message:'OTP NOT Found',
            })
        } else if(otp !== recentOtp.otp) {
         
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }


       
        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth: null,
            about:null,
            contactNumer:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            profileInformation:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,
        })

   
        return res.status(200).json({
            success:true,
            message:'User is registered Successfully',
            user,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registrered. Please try again",
        })
    }

}

 
exports.login = async (req, res) => {
    try {
        
        const {email, password} = req.body;
        
        if(!email || !password) {
            return res.status(403). json({
                success:false,
                message:'All fields are required, please try again',
            });
        }
       
        const user = await User.findOne({email}).populate("profileInformation");
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"User is not registrered, please signup first",
            });
        }
        
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user.token = token;
            user.password= undefined;

           
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in successfully',
            })

        }
        else {
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            });
        }
        
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        });
    }
};

 
exports.changePassword = async (req, res,next) => {

    try{
        const {oldPassword,newPassword,confirmNewPassword}=req.body;
      
         
        const user=await User.findById({_id:req.user._id})

        if(await bcrypt.compare(oldPassword,user.password)){
          
            if(newPassword!==confirmNewPassword){
                 return res.status(401).send({
                    message:"Password Not Matching"
                 })
            }
            else{
               
                const hashed=await bcrypt.hash(newPassword,10);
                const user=User.findByIdAndUpdate({_id:req.user._id},{password:hashed},{new:true})
                       
                mailSender(user.email,"Password Update Mail","Your Password has been changed")
                return res.status(200).send({
                    status:"success",
                    message:"Your Password Has been changed"
                 })
            }
          
        }
        else{
            return res.status(401).send({
                message:"Your old Password is Wrong"
             })
        }


    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Password Change Procedure Failure"
        })
    }
    

}
