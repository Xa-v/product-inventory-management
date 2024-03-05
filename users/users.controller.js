const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require("_middleware/validate-request");
const Role = require('_helpers/role');
const userService = require('./user.service');
const bcrypt = require("bcryptjs");

router.get('/profile', getprofile);
router.post("/", createSchema, create);
router.put("/profile/:id", updateSchema, update);
router.put("/profile/password/:id", updateSchemaPassword, updatePassword);
router.get("/search", searchSchema, searchUsers);
router.put("/:id/role", updateRole);
router.put("/:id/permission", updatePermission);
router.put('/:id/deactivate', deactivateSchema,deactivate);
router.put('/:id/reactivate', reactivateSchema,reactivate);

module.exports = router;


function getprofile(req, res, next) {
    userService.getprofile()
        .then(users => { const usersprofile = users.map(user => { return { id: user.id,username: user.username,firstname: user.firstname,lastname: user.lastname,email: user.email
                };
            }); res.json(usersprofile);
        })
        .catch(next);
}

function create(req, res, next) {
    userService
      .create(req.body)
      .then(() => res.json({message: "User created"}))
      .catch(next);
  }


  function createSchema(req, res, next) {
    const schema = Joi.object({
      username: Joi.string().required(),
      password: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),      
      email: Joi.string().email().required()
  
    });
    validateRequest(req, next, schema);
  }

  function update(req, res, next) {
    userService
      .update(req.params.id, req.body)
      .then(() => res.json({message: "User profile updated"}))
      .catch(next);
  }
  function updateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string(),
      firstname: Joi.string(),
      lastname: Joi.string(),
      email: Joi.string().email(),
    });
    validateRequest(req, next, schema);
  }
  

function updatePassword(req, res, next) {
    const {currentPassword, newPassword} = req.body;
    userService
      .updatePassword(req.params.id, currentPassword, newPassword)
      .then(() => res.json({message: "PASSWORD updated"}))
      .catch(next);
  }

  function updateSchemaPassword(req, res, next) {
    const schema = Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
    }).with("newPassword", "confirmPassword");
    validateRequest(req, next, schema);
  }
  
  function searchSchema(req, res, next) {
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
    });
    validateRequest(req, next, schema);
  }
  async function searchUsers(req, res, next) {
    try {
      const users = await userService.searchUsers(req.query);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async function updateRole(req, res, next) {
    const {id} = req.params;
    const {adminId, newRole} = req.body;
  
    try {
      await userService.updateUserRole(adminId, id, newRole);
      res.json({message: "User role updated"});
    } catch (error) {
      next(error);
    }
  }

  async function updatePermission(req, res, next) {
    const {id} = req.params;
    const {adminId, changePermission} = req.body;
  
    try {
      await userService.updatePermission(adminId, id, changePermission);
      res.json({message: "User permission updated"});
    } catch (error) {
      next(error);
    }
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

function deactivateSchema(req, res, next) {
  const schema = Joi.object({
      datedeactivated: Joi.date().default(new Date()).empty(),
      activestatus: Joi.boolean().valid(false).default(false).empty()
  });
  validateRequest(req, next, schema);
}
function reactivateSchema(req, res, next) {
  const schema = Joi.object({
      datereactivated: Joi.date().default(new Date()).empty(),
      activestatus: Joi.boolean().valid(true).default(true).empty()
  });
  validateRequest(req, next, schema);
}

