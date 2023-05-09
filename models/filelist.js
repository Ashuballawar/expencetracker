const mongoose=require('mongoose')
const validator=require('validator')
const Schema=mongoose.Schema;
const filelistSchema=new Schema({
    fileName:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }


})


module.exports=mongoose.model('Filelist',filelistSchema)