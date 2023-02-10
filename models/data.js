const Sequelize=require('sequelize');
const sequelize=require('../data/database')

const expencedata=sequelize.define('expencedata',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    amount:{
        type:Sequelize.DOUBLE,
        allowNull:false,
        
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    }
})

module.exports=expencedata