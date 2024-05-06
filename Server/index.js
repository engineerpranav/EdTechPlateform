const express=require("express");
const { connect } = require("./config/database");
const { sendVerificationEmail } = require("./model/otp");

const app= new express();


connect()

sendVerificationEmail("rajpurohitpranav@gmail.com","232");

app.listen(4000,()=>{
    console.log("Server is Listening")
})
