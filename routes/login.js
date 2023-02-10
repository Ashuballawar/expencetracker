const express=require('express')
const router=express.Router();
const controller=require('../controller/userDataController')
router.post('/user/login',controller.userlogin)

module.exports=router