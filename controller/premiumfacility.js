const expencedata=require('../models/data')
const jwt=require('jsonwebtoken')
const Data=require('../models/data');
const user=require('../models/userData');
const sequelize = require('sequelize');


exports.leaderborad=async(req,res,next)=>{
    try{
         
       let data=await user.find().sort({'TotalCost':-1})
       console.log(data)
         
          userExpencewithName=[];
          data.forEach(element => {
              
            if(element.Email==req.user.Email){
              element.Name='You'
            }
            userExpencewithName.push(element)
          });
          res.status(200).json(userExpencewithName)
       
    }
    catch(err){
      console.log(err);
      res.status(500).json({message:'something went wrong'})
    }
 
 
 }
 