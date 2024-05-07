const mongoose = require("mongoose");

const SubSection = new mongoose.Schema({
    
 title:{
    type:String
 },
 videoDuration:{
    type:String
 },
 description:{
    type:String
 },
 videolink:{
    type:String
 }



})
module.exports=mongoose.model("SubSection",SubSection) 
