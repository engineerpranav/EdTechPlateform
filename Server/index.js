const express=require("express");
const { connect } = require("./config/database");

const app= new express();


connect()

app.listen(400,()=>{
    console.log("Server is Listening")
})
