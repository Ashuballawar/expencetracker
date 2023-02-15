const expencedata=require('../models/data')
const jwt=require('jsonwebtoken')
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcryptjs');
const User=require('../models/userData');
require('dotenv').config()
const forgotpassword=require('../models/forgotpassword');
const { reset } = require('nodemon');

exports.forgotpassword=async (req,res)=>{
    try{
       let user=await User.findOne({where:{Email:req.body.Email}})
       if(user){
        const id=uuid.v4(); 
        await user.createForgotpassword({id,active:true})  
        // sgMail.setApiKey(process.env.SENGRID_API_KEY)
        // const msg = {
        //     to: email, // Change to your recipient
        //     from: 'yj.rocks.2411@gmail.com', // Change to your verified sender
        //     subject: 'Sending with SendGrid is Fun',
        //     text: 'Click on Reset password',
        //     html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
        // }                                                                                     
        let response=await res.status(201).json({link:`<a href="http://localhost:4000/password/resetpassword/${id}">Reset password</a>`})
             // let response=await sgMail.send(msg)                            
             console.log(response.statusCode)
       //  return res.status(201).json({message: 'Link to reset password sent to your mail ', success:true})
       // return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true}) 
             
    }
       else{
        
        res.status(400).json({msg:'User Not found'})
       }
}
catch(err){
    console.log(err)
    res.status(500).json({msg:'err'})
}
}

exports.resetpassword=async (req,res)=>{
    console.log(1)
  try{ 
     if(req.params.id){
    let forgotpasswordrequest=await forgotpassword.findOne({where:{id:req.params.id,active:true}})
   
    if(forgotpasswordrequest){
        forgotpasswordrequest.update({ active: false});
     res.status(200).send(`<html>
                               <form action='/password/updatepassword/${req.params.id}' method="POST">
                               <label for="newpassword">Enter New Password</label>
                               <input name="newpassword" id="newpassword" type="password" required>
                               <button>reset password</button>
                               </form>
                               </html>
                               <script>
                               function formOnsubmit(e){
                                e.preventDefault();
                                console.log('submitted')}  </script>
                                </html>
                         `)
    
     res.end()

    
                     }
   }
}
catch(err){
    console.log(err)
    res.status(500).json({error:err})
}

}

exports.updatepassword=async (req,res)=>{
          
    try{
    let newpassword=req.body.newpassword
          let id=req.params.id

let resetpasswordrequest=await forgotpassword.findOne({where:{id:id}})
     let user=await User.findOne({where:{id:resetpasswordrequest.userdatumId}})
    if(user){
        bcrypt.hash(newpassword,10,async(err,hash)=>{
            console.log(err)
            data=await user.update({Password:hash})
            res.status(201).json({message:'success'})
           
    })}}
    catch(err){
             res.status(500).json({error:err})
    }

}