const Sequelize=require('sequelize');
const sequelize=require('../data/database')

const fileList=sequelize.define('fileList',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
   fileName:Sequelize.STRING
})

module.exports=fileList