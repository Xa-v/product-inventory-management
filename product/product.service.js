const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
// const Role = require("_helpers/role");
const Role = require("../_helpers/role")
const {Op} = require("sequelize");

module.exports = {
    ViewProducts,
    getById,
    create,
    update,
    checkStockAvailability
  

    
    
};


async function ViewProducts({role}, options) {
    authorize(role, [Role.Admin, Role.Manager, Role.Customer]);

    return await db.Product.findAll(options);
}

async function getById({role},id, options) {
    authorize(role, [Role.Admin, Role.Manager, Role.Customer]);

    return await getProduct(id, options);
}


async function getProduct(id, options) {
    const product = await db.Product.findByPk(id, options);
    if (!product) throw 'Product not found';
    return product;
}

async function create({role},params) {
    // validate
    authorize(role, [Role.Admin, Role.Manager]);
    const product = new db.Product(params);
  
    await product.save();
}


async function update({role},id, params) {
    authorize(role, [Role.Admin, Role.Manager]);
    const product = await getProduct(id);


    Object.assign(product, params);
    await product.save();
}


async function checkStockAvailability(id, role) {
    authorize(role, [Role.Customer]);
  
    const product = await db.Product.findByPk(id);
  
    if (!product) throw "Product not found";
  
    return await db.Product.findByPk(id, {
        attributes: ["productname", "stockavailable"],
      });
  }

function authorize(role, allowedRoles) {
    if ( !role || !allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase()) ) {
      throw "Unauthorized user";
    }
  }
