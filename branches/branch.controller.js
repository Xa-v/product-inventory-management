const express = require("express");
const router = express.Router();
const Joi = require("joi");
const db = require("_helpers/db");
const validateRequest = require("_middleware/validate-request");

const branchService = require("./branch.service");

module.exports = router;

router.get("/", getAllBranch);
router.post("/", createBranch, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);
router.post("/:branchId/assign/:userId", assignUserToBranch);

function getAllBranch(req, res, next) {
  branchService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}


function create(req, res, next) {
    branchService
      .create(req.body)
      .then(() => res.json({ message: "Branch created" }))
      .catch(next);
  }


  function createBranch(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      location: Joi.string().required(),
      status: Joi.string(),
    });
    validateRequest(req, next, schema);
  }


  function update(req, res, next) {
    branchService
      .update(req.params.id, req.body)
      .then(() => res.json({ message: "Branch updated" }))
      .catch(next);
  }


  function updateSchema(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().empty(""),
      location: Joi.string().empty(""),
      status: Joi.string().empty(""),
    });
    validateRequest(req, next, schema);
  }
  

  function _delete(req, res, next) {
    branchService
      .delete(req.params.id)
      .then(() => res.json({ message: "Branch deleted" }))
      .catch(next);
  }
  

  function assignUserToBranch(req, res, next) {
    branchService
      .assignUserToBranch(req.params.branchId, req.params.userId)
      .then(() => res.json({ message: "Successfully assigned branch to User" }))
      .catch(next);
  }