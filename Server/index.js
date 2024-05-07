const express=require("express");
const { connect } = require("./config/database");
const { changePassword } = require("./controller/auth");

const app= new express();
app.use(express.json());

connect();
app.get('/',changePassword)
app.listen(4000,()=>{
    console.log("Server is Listening at locahost:4000")
})
