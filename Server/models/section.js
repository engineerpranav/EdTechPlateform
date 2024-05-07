const mongoose = require("mongoose");
 

const Section = new mongoose.Schema({
    
  name:{
    type:String
  },

  subSection:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SubSection"
  }

})
module.exports=mongoose.model("Section",Section) 
