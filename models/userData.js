const mongoose=require('mongoose')
const validator=require('validator')
const Data=require('./data')
const FileLists=require('./filelist')
const Schema=mongoose.Schema;
const userSchema=new Schema({
   
   Name:{
    type:String,
    required:true
   },
   Email:{
         type:String,
         required:true,
         unique:true,
          validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
          }
   },
   Password:{
            type:String,
            required:true
        },
   ispremiuruser:{
    type:Boolean,
  
   },

   TotalCost:{
    type:Number,
   default:0
   }
//    data:[{type:Schema.Types.ObjectId,ref:'Data'}],
//    filelist:[{type:Schema.Types.ObjectId,ref:'Filelist'}],
//    order:[{type:Schema.Types.ObjectId,ref:'Order'}],
//    forgotpassword:[{type:Schema.Types.ObjectId,ref:'Forgotpassword'}]


   


})

userSchema.methods.createExpencedatum=async function(amount,description,category){
let data=await Data.create({amount:amount,description:description,category:category,userId:this._id});
      this.TotalCost= parseInt(this.TotalCost)+parseInt(amount);
      this.save();

    return data

}

userSchema.methods.countFileLists=async function(){
  
    let total=await FileLists.countDocuments({userId:this._id})  
    console.log('total==>',total)
     return total
}

userSchema.methods.getFileLists=async function(a,b){
     let list=await FileLists.find({userId:this._id}).skip(a).limit(b)
     console.log('list=====>',list)
     return list
}


module.exports=mongoose.model('User',userSchema)