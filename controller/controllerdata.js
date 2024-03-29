const expencedata=require('../models/data')
const jwt=require('jsonwebtoken')
const AWS=require('aws-sdk')
const user=require('../models/userData');
const UserService=require('../services/userservices')
const uploadtos3=require('../services/s3services')
const FileList=require('../models/filelist');
// const { NULL } = require('mysql2/lib/constants/types');


function isinvalid(a){
   if(a===undefined||a.length===0){
      return true;
   }
   return false;
}


exports.addData=async (req,res,next)=>{
   
   if(isinvalid(req.body.amount)){
      return res.status(400).json({err:' amount is missing'})
   }
   
   
   try{
       
        const amount=req.body.amount
        const description=req.body.description
        const category=req.body.category   
         
     data=await req.user.createExpencedatum(amount,description,category)
     res.status(201).json(data)
     console.log('successfully AddData') 
      }
     
     
      catch(err){
        console.log(err)
        res.status(500).json({error:err})
       }
}
    


exports.getdata=async (req,res,next)=>{
   try{
      let page=1
      let n=5
      
     if(req.query.page){
      page=parseInt(req.query.page)
      }
      console.log('pagesize==>',req.query.pagesize)
      if(req.query.pagesize){
         console.log('jahsjshjdsjhdjkhi')
         n=0+parseInt(req.query.pagesize)
      }
      
      console.log(req.query.page)
       
        console.log("pagesize====>",n)
       
        let data=await expencedata.find({userId:req.user._id})
        console.log('dat===a===>',data)
       
        let totalFile=await req.user.countFileLists();
        let listOfDowloadedfile=await req.user.getFileLists((page-1)*n, n);   
         console.log(totalFile)
         console.log(page)
        console.log('successfully sendData') 
         currentPage=page
          hasNextPage=n*page<totalFile
          hasPreviousPage=page>1
          nextPage=page+1
          previousPage=page-1
          lastPage=Math.ceil(totalFile/n)
          console.log(hasNextPage,hasPreviousPage,nextPage,previousPage,lastPage)
         res.status(200).json({data,listOfDowloadedfile,currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage,lastPage})
 
}
   
   catch(err){
    console.log(err)
    res.status(500).json({error:err})
   }
}



exports.deleteData=async (req,res,next)=>{
   try{    
    if(!req.params.id){
        res.status(400).json({error:'wrong id'})
    }
    let data=await expencedata.findOneAndRemove({_id:req.params.id,userId:req.user._id})
  
      let User=await user.findOne({_id:req.user._id})
        User.TotalCost=parseInt(User.TotalCost)-parseInt(data.amount)
       let updatedata=await user.updateOne({_id:req.user._id},{$set:{TotalCost:User.TotalCost}})
      console.log(data)
      console.log('successfully deleted') 
      res.status(200).json(data) 
 
   }
   catch(err){
    console.log(err)
    res.status(500).json({error:err})
   }
}

exports.getDatabyId=async (req,res,next)=>{
   try{
    if(!req.params.id){
        res.status(400).json({error:'wrong id'})
    }
    data=await expencedata.find({id:req.params.id,userdatumId:req.user.id})
    console.log('successfully sendData') 
    res.status(200).json(data[0])  
   }
   catch(err){
    console.log(err)
    res.status(500).json({error:err})
   }
}
    
exports.downloadexpence=async (req,res)=>{
   try{
      const expenceData=await expencedata.find({userId:req.user._id})
      console.log('====>',expenceData)
      arrayOfData=[]
      expenceData.forEach(element => {
         arrayOfData.push({amount:element.amount,description:element.description,category:element.category})
     });
     let stringifiedExpence=JSON.stringify(arrayOfData)
     let filename=`Expense${req.user.id}/${new Date()}.txt`
     let fileURL=await uploadtos3.uploadToS3(stringifiedExpence,filename);
      let fileName=await FileList.create({fileName:filename,userId:req.user._id})

    //let listOfFile=await req.user.getFileLists()
       
     res.status(200).json({fileURL,success:true,fileName:fileName})
   }
   catch(err){
      console.log(err)
      res.status(500).json({err:err,success:false})
   }
   }
 
