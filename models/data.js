const mongoose=require('mongoose')
const validator=require('validator')
const Schema=mongoose.Schema;
const dataSchema=new Schema({
   
amount:{
    type:Number,
    required:true
},
description:{
    type:String,
    allowNull:false,
},
category:{
    type:String,
    required:true
},
userId:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
}



})


module.exports=mongoose.model('Data',dataSchema)