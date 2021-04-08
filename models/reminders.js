const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");


const Reminder = sequelize.define("reminder", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    description: DataTypes.TEXT,
    date: DataTypes.DATE,
    user: DataTypes.INTEGER
}, { timestamps: false });

module.exports = Reminder;
