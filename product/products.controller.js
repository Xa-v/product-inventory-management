const express = require('express');
const router = express.Router();
const Joi = require('joi');

const validateRequest = require('_middleware/validate-request');

const productService = require('./product.service');


// routes


router.get('/',getAll);
router.get('/:id', getById)
router.post('/', createSchema, create)

router.put('/:id', updateSchema, update)

router.get('/:id/availability',getAvailable )

module.exports = router;

// route functions

async function getAll(req, res, next) {
    try {
        const products = await productService.getAll(req.query, {
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


function update(req, res, next) {
    productService.update(req.query,req.params.id, req.body)
        .then(() => res.json({ message: 'Product updated'}))
        .catch(next);
}






function createSchema(req, res, next) {
    const schema = Joi.object( {   
        productname: Joi.string().required(),
        productcategory: Joi.string().required(),
        quantity: Joi.string(),
        price: Joi.string().required(),
      
       
        isactive: Joi.string().valid('1').default('1').empty()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object( {   
        productname: Joi.string(),
        productcategory: Joi.string(),
        price: Joi.string(),
      
    });
    validateRequest(req, next, schema);
}



async function getAvailable(req, res, next) {
    try {
        const product = await productService.getById(req.query,req.params.id, {
            attributes: [ "productname", "productcategory", "quantity"],
        });

       
        const modifiedProduct = {
            productname: product.productname,
            productcategory: product.productcategory,
            "Stock Available": `${product.quantity}`
        };

        
        res.json(modifiedProduct);
    } catch (error) {
        next(error);
    }
}



