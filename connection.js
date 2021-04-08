const {Sequelize} = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");
const Trades = require('./models/reminders');

return sequelize.authenticate()
    .then(result => {
        console.log(`SQLite successfully connected!`);
        return Trades.sync();
    })
    .then(result => {
        console.log(`Trades table created`);
        return result;
    })
    .catch(error => {
        console.error('Unable to connect to SQLite database:', error);
    })
