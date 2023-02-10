const expencedata=require('../models/data')
const jwt=require('jsonwebtoken')

const user=require('../models/userData');
const sequelize = require('sequelize');


exports.leaderborad=async(req,res,next)=>{
    try{
       
        
           
           allUser=await user.findAll({
            attributes:['Name',[sequelize.fn('sum',sequelize.col('expencedata.amount')),'total_cost']],
            include:[
                {
                    model:expencedata,
                    attributes:[]
                }
            ],

            group:['id'],
            order:[[sequelize.col('total_cost'),"DESC"]]
             }  );
          userExpencewithName=[];
          allUser.forEach(element => {
            userExpencewithName.push(element.dataValues)
          });
          res.status(200).json(userExpencewithName)
       
    }
    catch(err){
      console.log(err);
      res.status(500).json({message:'something went wrong'})
    }
 
 
 }
 