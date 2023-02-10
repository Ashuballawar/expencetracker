const Razorpay=require('razorpay');
const Order = require('../models/orders');
const jwt=require('jsonwebtoken')
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
           req.user.createOrder({orderid:order.id,status:'PENDING'})
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
        const order= await Order.findOne({where:{orderid:order_id}})
        promise1=await order.update({paymentid:payment_id,status:"SUCCESSFULL"})
        promise2=await req.user.update({ ispremiuruser:true})
        Promise.all([promise1,promise2]).then(()=>{
            return res.status(202).json({success:true,message:"Transaction Successfull",token:generateAccessToken(req.user.id,req.user.Name,true)})
        }).catch((err)=>{
                   throw new Error(err)})
               
   
    }
    catch(err){
        res.status(500).json({msg:err})
    }
}

exports.updateTransactionfailed=async (req,res,next)=>{
    try{
        const {payment_id,order_id}=req.body
           const order= await Order.findOne({where:{orderid:order_id}})
           promise1=await order.update({paymentid:payment_id,status:"Failed"})
           promise2=await req.user.update({ ispremiuruser:false})
           Promise.all([promise1,promise2]).then(()=>{
               return res.status(202).json({success:true,message:"Transaction Failed"})
           }).catch((err)=>{
                      throw new Error(err)})
                  
      
       }
       catch(err){
           res.status(500).json({msg:err})
       }
   }

  