
const jwt=require('jsonwebtoken')
const AWS=require('aws-sdk')

const sequelize=require('../data/database')

const expencedata=require('../models/data')
const user=require('../models/userData');
const fileList=require('../models/filelist');
const userData=require('../models/userData')


const UserService=require('../services/userservices')
const uploadtos3=require('../services/s3services')



const { NULL } = require('mysql2/lib/constants/types');


function isinvalid(a){
   if(a===undefined||a.length===0){
      return true;
   }
   return false;
}


exports.addData=async (req,res,next)=>{
   let t=await sequelize.transaction();
  
   if(isinvalid(req.body.amount)){
      return res.status(400).json({err:' amount is missing'})
   }
   
   
   try{
       
        const amount=req.body.amount
        const description=req.body.description
        const category=req.body.category   
      
     data=await req.user.createExpencedatum({amount:amount,description:description,category:category},{transaction:t})

    UpdatedData=await userData.update({TotalExpence:(parseInt(req.user.TotalExpence)||0)+parseInt(amount)},{where:{id:req.user.id},transaction:t})
     await t.commit();
    res.status(201).json(data)
     console.log('successfully AddData') 
      }
     
     
      catch(err){
         await t.rollback();
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
         
         n=0+parseInt(req.query.pagesize)
      }
      
      console.log(req.query.page)
       
        console.log("pagesize====>",n)
        data=await expencedata.findAll({where:{userdatumId:req.user.id}})
        let totalFile=await req.user.countFileLists();
        let listOfDowloadedfile=await req.user.getFileLists({ offset:(page-1)*n, limit: n });   
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
   let t=await sequelize.transaction();   
  
   try{ 

   
    if(!req.params.id){
        res.status(400).json({error:'wrong id'})
    }
    deletedData=await req.user.getExpencedata({where:{id:req.params.id},transaction:t})
    
    data=await expencedata.destroy({where:{id:req.params.id,userdatumId:req.user.id},transaction:t})

    UpdatedData=await userData.update({TotalExpence:(parseInt(req.user.TotalExpence))-parseInt(deletedData[0].dataValues.amount)},{where:{id:req.user.id},transaction:t})
     if(data===1){
      await t.commit()
      console.log('successfully deleted') 
      res.status(200).json(data) 
     }
     else{
  
    return res.status(400).json({msg:"wrong input"}) 
      
   }}
   catch(err){
    console.log(err)
    await t.rollback();
    res.status(500).json({error:err})
   }
}





exports.getDatabyId=async (req,res,next)=>{
   try{
    if(!req.params.id){
        res.status(400).json({error:'wrong id'})
    }
    data=await expencedata.findAll({where:{id:req.params.id,userdatumId:req.user.id}})
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
      const expenceData=await UserService.getExpences(req)
      arrayOfData=[]
      expenceData.forEach(element => {
         arrayOfData.push({amount:element.dataValues.amount,description:element.dataValues.description,category:element.dataValues.category,time:element.dataValues.createdAt})
     });
     let stringifiedExpence=JSON.stringify(arrayOfData)
     let filename=`Expense${req.user.id}/${new Date()}.txt`
     let fileURL=await uploadtos3.uploadToS3(stringifiedExpence,filename);
      let fileName=await req.user.createFileList({fileName:filename,})

    //let listOfFile=await req.user.getFileLists()
       
     res.status(200).json({fileURL,success:true,fileName:fileName})
   }
   catch(err){
      console.log(err)
      res.status(500).json({err:err,success:false})
   }
   }
 
