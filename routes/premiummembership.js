const express=require('express')
 
router=express.Router()
const getDataMiddleware=require('../middleware/auth')
const premiummembershipcontroller=require('../controller/premiummembership')

router.get('/premiummembership',getDataMiddleware,premiummembershipcontroller.purchasepremium)
router.post('/premiummembership',getDataMiddleware,premiummembershipcontroller.updateTransactionStatus)
router.post('/premiummembershipfailed',getDataMiddleware,premiummembershipcontroller.updateTransactionfailed)
module.exports=router;
