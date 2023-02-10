let express=require('express')
// const getDataMiddleware=require('../middleware/auth')
const router=express.Router();
const controller=require('../controller/forgotpassword')


router.post('/forgotpassword',controller.forgotpassword)
router.get('/resetpassword/:id',controller.resetpassword)
router.post('/updatepassword/:id',controller.updatepassword)

module.exports=router

