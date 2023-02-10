const express=require('express')

const router=express.Router();
const controller=require('../controller/userDataController')

router.post('/user/signup',controller.adduserdata)

module.exports=router;
