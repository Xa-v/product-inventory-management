const db = require("_helpers/db");
const {Op} = require("sequelize");
const Role = require("../_helpers/role");

module.exports = {
 
  viewOrders,
  getOrderById,
  createNewOrder,
  updateOrder,
  cancel,
  getOrderStatus
};



async function viewOrders({role}) {
  authorize(role, [Role.Admin, Role.Manager]);

  return await db.Orders.findAll({
    attributes: ["id", "productname", "customername"],
  });
}

async function getOrderById(id, role) {
    authorize(role, [Role.Admin, Role.Manager]);
  
    const order = await db.Orders.findByPk(id);
    if (!order) throw "Order not found";
    return order;
  }

  async function createNewOrder(params) {
    const product = new db.Orders(params);
    await product.save();
  }

  async function updateOrder(id, params, role) {
    const order = await db.Orders.findByPk(id);
    if (!order) throw "Order not found";
  
    if (isCustomerUpdate(params, role)) {
      Object.assign(order, params);
      await order.save();
    } else {
      authorize(role, [Role.Admin, Role.Manager]);
      Object.assign(order, params);
      await order.save();
    }
  
  }



  async function cancel(id, params) {
    const order = await db.Orders.findByPk(id);
    if (!order) throw "Order not found";
  
    // Regardless of the role, update the order
    Object.assign(order, params);
    await order.save();
}


async function getOrderStatus(id) {
    const order = await db.Orders.findByPk(id);
    if (!order) throw "Order not found";
  
    return getStatusMessage(order.orderStatus);
  }

  function getStatusMessage(orderStatus) {
    const statusMessages = {
      0: "Order Cancelled",
      1: "Placing Order",
      2: "Order Processed",
      3: "Order Shipped",
      4: "Order is out for delivery",
      5: "Order has been Delivered",
    };
    return statusMessages[orderStatus] || "eror!?";
  }


function authorize(role, allowedRoles) {
    if ( !role || !allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase()) ) {
      throw "Unauthorized user";
    }
  }


  function isCustomerUpdate(params, role) {
    return (
      Object.keys(params).length === 1 &&
      "orderStatus" in params &&
      params.orderStatus === 0 &&
      role.toLowerCase() === Role.Customer.toLowerCase()
    );
  }