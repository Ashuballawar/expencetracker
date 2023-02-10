const express=require('express');
//const getDataMiddleware=require('../middleware/auth')
const getDataMiddleware=require('../middleware/auth')
const router=express.Router();
const controller=require('../controller/controllerdata')


router.get('/getdata',getDataMiddleware,controller.getdata);
router.post('/addData',getDataMiddleware,controller.addData);

router.delete('/deleteData/:id',getDataMiddleware,controller.deleteData)

router.get('/getdata/:id',getDataMiddleware,controller.getDatabyId);
router.get('/download',getDataMiddleware,controller.downloadexpence)
module.exports=router
