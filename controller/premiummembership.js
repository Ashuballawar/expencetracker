const Razorpay=require('razorpay');
const Order = require('../models/orders');
const jwt=require('jsonwebtoken')
const User=require('../models/userData')
require('dotenv').config()

function generateAccessToken(Id,Name,ispremiuruser){
    return jwt.sign({userdatumId:Id,Name:Name,ispremiuruser},process.env.JWT_SECRET)
 }
 
exports.purchasepremium=async (req,res,next)=>{
   try{   console.log(process.env.RAZORPAY_KEY_ID)
     var rzp=new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID , 
        key_secret:process.env.RAZORPAY_KEY_SECRET
      })
   const amount=2500;
   rzp.orders.create({amount,currency:"INR"},(err,order)=>{
           if(err){
            throw new Error(err)
           }
          Order.create({orderid:order.id,status:'PENDING',userId:req.user._id})
           .then(()=>{
          return res.status(201).json({order,key_id:rzp.key_id}) })
         .catch(err=>{
          throw new Error(err)
})                          
   })

   }
   catch(err){
    console.log(err)
   
           res.status(500).json({msg:err})
   }
}

exports.updateTransactionStatus=async (req,res,next)=>{
    try{
     const {payment_id,order_id}=req.body
        const order= await Order.findOne({orderid:order_id})
        promise1=await order.updateOne({paymentid:payment_id,status:"SUCCESSFULL"})
        promise2=await User.updateOne({ ispremiuruser:true,userId:req.user._id})
        Promise.all([promise1,promise2]).then(()=>{
            return res.status(202).json({success:true,message:"Transaction Successfull",token:generateAccessToken(req.user.id,req.user.Name,true)})
        }).catch((err)=>{
                   throw new Error(err)})
               
   
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg:err})
    }
}

exports.updateTransactionfailed=async (req,res,next)=>{
    try{
        const {payment_id,order_id}=req.body
           const order= await Order.findOne({orderid:order_id})
           promise1=await order.updateOne({paymentid:payment_id,status:"Failed"})
           promise2=await User.updateOne({ ispremiuruser:false,userId:req.user._id})
           Promise.all([promise1,promise2]).then(()=>{
               return res.status(202).json({success:true,message:"Transaction Failed"})
           }).catch((err)=>{
                      throw new Error(err)})
                  
      
       }
       catch(err){
        console.log(err)
           res.status(500).json({msg:err})
       }
   }

  