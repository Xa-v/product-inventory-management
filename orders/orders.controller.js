const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const orderService = require("./order.service");
const Role = require("../_helpers/role"); 


router.get("/", viewOrders);
router.get("/:id", getOrderById);
router.post("/", createSchema, createOrder);
router.put("/:id", updateSchema, updateOrder);
router.put("/:id/cancel", cancel, cancelOrder);
router.get("/:id/status", getOrderStatus);
router.put("/:id/process", process, ProcessOrder);
router.put("/:id/ship", ship, ShipOrder);
router.put("/:id/deliver", deliver, DeliverOrder);
module.exports = router;



async function viewOrders(req, res, next) {
  try {
    const orders = await orderService.viewOrders(req.query);
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

async function getOrderById(req, res, next) {
    const { role } = req.query;
    try {
      const order = await orderService.getOrderById(req.params.id, role);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async function createOrder(req, res, next) {
    try {
      await orderService.createNewOrder(req.body);
      res.json({ message: "Order Placed!" });
    } catch (error) {
      next(error);
    }
  }

  function createSchema(req, res, next) {
    const schema = Joi.object({
      productname: Joi.string().required(),
      quantity: Joi.number().required(),     
      customername: Joi.string().required(),
      orderStatus: Joi.number().default(1),
    });
    validateRequest(req, next, schema);
  }

  async function updateOrder(req, res, next) {
    const { role } = req.query;
    try {
      await orderService.updateOrder(req.params.id, req.body, role);
      res.json({ message: "Order updated" });
    } catch (error) {
      next(error);
    }
  }

  function updateSchema(req, res, next) {
    const schema = Joi.object({
      productname: Joi.string(),
      customername: Joi.string(),
      quantity: Joi.number(),  
      orderStatus: Joi.number().valid(0, 1, 2, 3, 4, 5),
    });
    validateRequest(req, next, schema);
  }

  

  async function cancelOrder(req, res, next) {
    try {
        // Remove role from the destructuring assignment
        const {} = req.query;
        await orderService.cancel(req.params.id, req.body);
        res.json({ message: "Order Cancelled :(" });
    } catch (error) {
        next(error);
    }
}

 
function cancel(req, res, next) {
    const schema = Joi.object({
        orderStatus: Joi.number().default(0),
    });
    validateRequest(req, next, schema);
}

async function getOrderStatus(req, res, next) {
    try {
      const orderStatus = await orderService.getOrderStatus(req.params.id);
      res.json({ orderStatus });
    } catch (error) {
      next(error);
    }
  }

  async function ProcessOrder(req, res, next) {
    const { role } = req.query;
    try {
      await orderService.updateOrder(req.params.id, req.body, role);
      res.json({ message: "Order PRoccessed! " });
    } catch (error) {
      next(error);
    }
  }

  function process(req, res, next) {
    const schema = Joi.object({
  
        orderStatus: Joi.number().default(2),
    });
    validateRequest(req, next, schema);
  }

  async function ShipOrder(req, res, next) {
    const { role } = req.query;
    try {
      await orderService.updateOrder(req.params.id, req.body, role);
      res.json({ message: "Order Shipped uwu " });
    } catch (error) {
      next(error);
    }
  }

  function ship(req, res, next) {
    const schema = Joi.object({
  
        orderStatus: Joi.number().default(3),
    });
    validateRequest(req, next, schema);
  }

  async function DeliverOrder(req, res, next) {
    const { role } = req.query;
    try {
      await orderService.updateOrder(req.params.id, req.body, role);
      res.json({ message: "Order Successfully Delivered " });
    } catch (error) {
      next(error);
    }
  }

  function deliver(req, res, next) {
    const schema = Joi.object({
  
        orderStatus: Joi.number().default(5),
    });
    validateRequest(req, next, schema);
  }