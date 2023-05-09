const express=require('express');
const helmet=require('helmet');
const morgan=require('morgan');
const fs=require('fs');
const path=require('path')
const mongoose=require('mongoose')


const app=express();


const bodyParser=require('body-parser')


const expenceDataRouter=require('./routes/expencedata')
const signupUserDataRouter=require('./routes/postUserData')
const loginUserRouter=require('./routes/login')
const premiumUserRouter=require('./routes/premiummembership')
const premiumfacilityRouter=require('./routes/premiumfacility')
const forgotpasswordrouter=require('./routes/forgetpassword')


const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});


var cors = require('cors')
app.use(cors());
//app.use(helmet());
app.use(morgan('combined',{stream:accessLogStream}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());


app.use('/user',expenceDataRouter)
app.use(signupUserDataRouter)
app.use(loginUserRouter)
app.use('/purchase',premiumUserRouter)
app.use('/premium',premiumfacilityRouter)
app.use('/password',forgotpasswordrouter)
app.use((req,res)=>{
    console.log(req.url)
    res.sendFile(path.join(__dirname,`view/${req.url}`))
})
mongoose.connect('mongodb+srv://ashutoshballawar:ashutoshballawar@cluster0.cxidpz2.mongodb.net/expencetracker1?retryWrites=true&w=majority')
.then(result=>{
   
         console.log('connected')
        app.listen(3000)
    
}).catch(err=>{
    console.log(err)
})
