// const Sequelize=require('sequelize');
// const sequelize=require('../data/database')
const mongoose=require('mongoose')
const validator=require('validator')
const Schema=mongoose.Schema;
const forgotpasswordSchema=new Schema({
 _id:{
   type:Schema.Types.UUID,
   required:true  
 },
 
   active: {
         type:Boolean,
         required:true
   },
   userId:{
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true
  }
})


module.exports=mongoose.model('Forgotpassword',forgotpasswordSchema)