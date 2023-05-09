const jwt=require('jsonwebtoken')

const User=require('../models/userData')
require('dotenv').config()
const authenticate=async (req,res,next)=>{
      try{
        let token=req.header('Authorization')
        const Token=jwt.verify(token,process.env.JWT_SECRET)
        console.log("userid===>",Token.userdatumId)
        let user =await User.findById(Token.userdatumId)
            console.log('======>',user)
        req.user=user;
        next();
      }
      catch(err){
        console.log(err)
            return res.status(500).json({msg:err})
      } 
}

module.exports=authenticate