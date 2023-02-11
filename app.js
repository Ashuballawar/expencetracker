const express=require('express');
const helmet=require('helmet');
const morgan=require('morgan');
const fs=require('fs');
const path=require('path')

const sequelize=require('./data/database')
const user=require('./models/userData')
const expencedata=require('./models/data')
const Order=require('./models/orders')
const app=express();


const bodyParser=require('body-parser')


const expenceDataRouter=require('./routes/expencedata')
const fileList=require('./models/filelist')
const signupUserDataRouter=require('./routes/postUserData')
const loginUserRouter=require('./routes/login')
const premiumUserRouter=require('./routes/premiummembership')
const premiumfacilityRouter=require('./routes/premiumfacility')
const forgotpasswordrouter=require('./routes/forgetpassword')
const forgotpassword=require('./models/forgotpassword')

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});


var cors = require('cors')
app.use(cors());
//app.use(helmet());
app.use(morgan('combined',{stream:accessLogStream}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
user.hasMany(expencedata);
expencedata.belongsTo(user);
user.hasMany(Order)
Order.belongsTo(user)
user.hasMany(forgotpassword);
forgotpassword.belongsTo(user);
user.hasMany(fileList)
fileList.belongsTo(user)
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
sequelize.sync().then(result=>{
  
    app.listen(process.env.PORT||4000)
}).catch(err=>{
    console.log(err)
})
