const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("_middleware/validate-request");
const inventoryService = require("./inventory.service");

// Routes
router.post("/", createSchema, createInventory);
router.get("/", viewInventory);

module.exports = router;

// Controller functions

// Create a new inventory
async function createInventory(req, res, next) {
  const {role} = req.query;

  try {
    await inventoryService.createNewInventory(req.body, role);
    res.json({message: "Inventory updated successfully!!"});
  } catch (error) {
    next(error);
  }
}

async function viewInventory(req, res, next) {
  try {
    const inventories = await inventoryService.viewInventory(req.query);
    res.json(inventories);
  } catch (error) {
    next(error);
  }
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    productID: Joi.number().required(),
    stockIn: Joi.number().optional().when('stockOut', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required()
    }),
    stockOut: Joi.number().optional(),
  });
  validateRequest(req, next, schema);
}