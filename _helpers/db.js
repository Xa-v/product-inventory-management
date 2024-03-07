const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password});
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, {dialect: 'mysql'});

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);
    db.OldPassword = require("../users/oldPassword.model")(sequelize);
    db.Updated = require("../users/updated.model")(sequelize);
    db.Product = require('../product/product.model')(sequelize);
    db.Inventory = require("../inventory/inventory.model")(sequelize)
    db.Orders = require('../orders/order.model')(sequelize);
    db.Branches = require("../branches/branch.model")(sequelize);
    db.UserBranch = require("../users/userbranch.model")(sequelize);
    // sync all models with database
    await sequelize.sync({alter: true});
}
