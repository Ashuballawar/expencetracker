const Sequelize=require('sequelize');
const sequelize=require('../data/database')

const forgotpassword=sequelize.define('forgotpassword',{
     id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey:true

     },
     active: Sequelize.BOOLEAN,
   


})
module.exports=forgotpassword;