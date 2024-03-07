const express = require('express');
const router = express.Router();
const Joi = require('joi');

const validateRequest = require('_middleware/validate-request');

const productService = require('./product.service');



router.get('/',ViewProducts);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.get("/:id/availability", checkStockAvailability); // Get Product by ID

module.exports = router;
async function ViewProducts(req, res, next) {
    try {
        const products = await productService.ViewProducts(req.query, {
            attributes: ["id", "productname", "price", "productcategory"]
        });

        // Manipulate the products array to add a dollar sign to the price
        const productsWithDollarSign = products.map(product => ({
            ...product.dataValues,
            price: `$${product.price}`
        }));

        res.json(productsWithDollarSign);
    } catch (error) {
        next(error);
    }
}

async function getById(req, res, next) {
    try {
        const product = await productService.getById(req.query,req.params.id, {
            attributes: ["id", "productname", "price", "productcategory"],
         
        });

        
        const productWithDollarSign = {
            ...product.dataValues,
            price: `$${product.price}`
        };

        res.json(productWithDollarSign);
    } catch (error) {
        next(error);
    }
}


function create(req, res, next) {
    productService.create(req.query,req.body)
        .then(() => res.json({message: 'Product Added'}))
        .catch(next);
}


function createSchema(req, res, next) {
    const schema = Joi.object( {   
        productname: Joi.string().required(),
        price: Joi.number().integer().required(),
        productcategory: Joi.string().required()
       
      
    
    });
    validateRequest(req, next, schema);
}



function update(req, res, next) {
    productService.update(req.query,req.params.id, req.body)
        .then(() => res.json({ message: 'Product updated'}))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object( {   
        productname: Joi.string(),
        productcategory: Joi.string(),
        price: Joi.number().integer()
      
    });
    validateRequest(req, next, schema);
}

async function checkStockAvailability(req, res, next) {
    const {role} = req.query;
    try {
      const product = await productService.checkStockAvailability(req.params.id, role);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }