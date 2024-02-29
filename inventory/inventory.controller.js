const express = require('express');
const router = express.Router();
const Joi = require('joi');

const validateRequest = require('_middleware/validate-request');

const productService = require('./inventory.service');



module.exports = router;

router.get('/',getAll);
router.post('/', validateUpdateInventoryRequest, updateInventory);

async function getAll(req, res, next) {
    try {
        const products = await productService.getAll(req.query,{
            attributes: ["id", "productname", "productcategory", "quantity"]
        });

        res.json(products);
    } catch (error) {
        next(error);
    }
}




async function updateInventory(req, res, next) {
    try {
       
        const {id,  quantity } = req.body;

        // Validate request body
        if (!id ) {
            return res.status(400).json({ message: "id and quantity are required" });
        }

        // Update inventory
        await productService.updateInventory(id, quantity,req.query);

        res.json({ message: "Inventory updated successfully" });
    } catch (error) {
        next(error);
    }
}

function validateUpdateInventoryRequest(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required(),
        quantity: Joi.number().min(0).required()
    });

    validateRequest(req, next, schema);
}