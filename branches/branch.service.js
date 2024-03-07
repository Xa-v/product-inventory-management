const bcrypt = require("bcryptjs");
const db = require("_helpers/db");

module.exports = {
  getAll,
  getBranch,
  create,
  update,
  delete: _delete,
  assignUserToBranch,
};

async function getAll() {
  return await db.Branches.findAll({
    attributes: ["id", "name", "location"],
  });


  }

 
  async function getBranch(id) {
    const branch = await db.Branches.findByPk(id, {
        attributes: ['id', 'name', 'location'] 
    });
    if (!branch) throw "branch not found";
    return branch;
}



  async function create(params) {
    const branch = new db.Branches(params);
    await branch.save();
  }
  

  async function update(id, params) {
    const branch = await getBranch(id);
    console.log("Initial branch status:", branch.status);
  
   
    const branchChanged = branch.branch !== params.branch;
    const statusChanged = branch.status !== params.status;
  
    if (
      branchChanged &&
      (await db.Branches.findOne({ where: { branch: params.branch } }))
    ) {
      console.log('Branch "' + params.branch + '" is already registered');
    }
  
    if (statusChanged) {
      console.log("Before setting status:", branch.status);
  
      branch.status = params.status;
      console.log("After setting status:", branch.status);
    } else {
      console.log('Status "' + branch.status + '" is already registered');
    }
  
    
  
    Object.assign(branch, params);
    await branch.save();
  }
  

  async function _delete(id) {
    const branch = await getBranch(id);
    await branch.destroy();
  }
  


  async function assignUserToBranch(branchId, userId) {
    try {
      const existingAssignment = await db.UserBranch.findOne({
        where: { userId, branchId },
      });
  
      if (existingAssignment) {
        throw { status: 400, message: "User already assigned to this branch" };
      }
      // Check if the branch and user exist in the database
      const branch = await db.Branches.findByPk(branchId, {
        attributes: ["id", "name", "location", "status"],
      });
      const user = await db.User.findByPk(userId, {
        attributes: ["id", "email", "passwordHash", "username"],
      });
  
      if (!branch || !user) {
        throw { status: 404, message: "Branch or user not found" };
      }
  
      // Assign the user to the branch (update the database accordingly)
      user.assignedBranchId = branchId;
      await user.save();
  
      await db.UserBranch.create({
        userId: user.id,
        username: user.username,
        branchId: branch.id,
        branchName: branch.name,
      });
  
      // Respond with a success message
      return "User assigned to branch successfully";
    } catch (error) {
      console.error(error);
      throw { status: 500, message: "Internal Server Error" };
    }
  }