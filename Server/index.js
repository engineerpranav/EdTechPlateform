const express=require("express");
const { connect } = require("./config/database");
const { uploadImageToCloudinary } = require("./utils/imageUploader");


const app= new express();
app.use(express.json());

connect();

app.listen(4000,()=>{
    console.log("Server is Listening at locahost:4000")
})
