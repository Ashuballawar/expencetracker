const Sequelize=require('sequelize');
const sequelize=require('../data/database')

const userData=sequelize.define('userdata',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    Name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    Email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    Password:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    ispremiuruser:Sequelize.BOOLEAN,
    TotalExpence:{
        type:Sequelize.INTEGER
    }

})

module.exports=userData