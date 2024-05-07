const mongoose = require("mongoose");

const ratingsAndReviews = new mongoose.Schema({
    
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  ratings:{
    type:Number,
    required:true
  },
  reviews:{
    type:String,
    required:true
  }

})
module.exports=mongoose.model("RatingsAndReviews",ratingsAndReviews) 
