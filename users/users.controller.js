const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const validateRequest = require('_middleware/validate-request');
const Role = require('_helpers/role');
const userService = require('./user.service');

// routes

router.get('/', getAll);
router.get('/:id', getById)
router.post('/', createSchema, create)
router.post('/login', loginSchema, login)
router.put('/:id', updateSchema, update)
router.delete('/:id', _delete);
router.put('/:id/deactivate', deactivateSchema,deactivate)
router.put('/:id/reactivate', reactivateSchema,reactivate)


module.exports = router;

// route functions

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next)
}

function create(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({message: 'User created'}))
        .catch(next);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User updated'}))
        .catch(next);
}

function deactivate(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'user deactivated'}))
        .catch(next);
}
function reactivate(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'User Activated'}))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({message: 'User deleted'}))
        .catch(next);
}




function login(req, res, next) {
    userService.getByUsername(req.body.userName)
        .then(user => {
          
            if (!user) {
                return res.status(404).json({ message: 'User does not exist' });
            }

            if (user.isactive !== '1') {
                return res.status(401).json({ message: 'User is not active' });
            }

            
           
            res.json({ message: 'Login successful' });
        })
        .catch(next);
}





// schema functions

function createSchema(req, res, next) {
    const schema = Joi.object( {   
        userName: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
       
        isactive: Joi.string().valid('1').default('1').empty()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        userName: Joi.string().empty(''),
        password: Joi.string().min(6).empty(''),
        confirmPassword: Joi.string().valid(Joi.ref('password')).empty('')
    }).with('password', 'confirmPassword');
    validateRequest(req, next, schema);
}

function loginSchema(req, res, next) {
    const schema = Joi.object( {   
        userName: Joi.string().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    });
    validateRequest(req, next, schema);
}




function deactivateSchema(req, res, next) {
    const schema = Joi.object({
        datedeactivated: Joi.date().default(new Date()).empty(),
        isactive: Joi.string().valid('0').default('0').empty()
    });
    validateRequest(req, next, schema);
}
function reactivateSchema(req, res, next) {
    const schema = Joi.object({
        datereactivated: Joi.date().default(new Date()).empty(),
        isactive: Joi.string().valid('1').default('1').empty()
    });
    validateRequest(req, next, schema);
}

