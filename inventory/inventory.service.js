const db = require("_helpers/db");
const Role = require("../_helpers/role")
const {Op} = require("sequelize");

module.exports = {
    getAll,
    updateInventory
};

async function getAll({role},options) {
    authorize(role, [Role.Admin, Role.Manager]);
    return await db.Product.findAll(options);
}

async function updateInventory(productId, newQuantity,{role}) {

   
    const product = await db.Product.findByPk(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    // Update quantity
    product.quantity = newQuantity;
    authorize(role, [Role.Admin, Role.Manager]);
    await product.save();
}

function authorize(role, allowedRoles) {
    if ( !role || !allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase()) ) {
      throw "Unauthorized user";
    }
  }