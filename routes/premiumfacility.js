const express=require('express')
const getDataMiddleware=require('../middleware/auth')
const router=express.Router();
const controller=require('../controller/premiumfacility')

router.get('/leaderboard',getDataMiddleware,controller.leaderborad)

module.exports=router;