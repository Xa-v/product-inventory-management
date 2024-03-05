const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

const {Op} = require("sequelize");
const {func} = require("joi");

module.exports = {
    getprofile,
    create,
    update,
    updatePassword,
    searchUsers,
    updateUserRole,
    updatePermission,
    deactivate,
    reactivate
  
    
};

async function getprofile() {
    return await db.User.findAll();
}

async function create(params) {
    // validate
    if (await db.User.findOne({where: {email: params.email}})) {
      throw 'Email "' + params.email + '" is already registered';
    }
    // validate
    if (await db.User.findOne({where: {username: params.username}})) {
      throw 'Username "' + params.username + '" is already taken';
    }
  
    const user = new db.User(params);
  
    // has password
    user.passwordHash = await bcrypt.hash(params.password, 10);
  
    // save user
    await user.save();
  }
  async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw "User not found";
    return user;
  }

  async function update(id, params) {
    const user = await getUser(id);
  
    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (
      usernameChanged &&
      (await db.User.findOne({where: {username: params.username}}))
    ) {
      throw 'Username "' + params.username + '" is already taken';
    }
  
    // copy params to user and save
    Object.assign(user, params);
    await user.save();
  }

async function updatePassword(id, currentPassword, newPassword) {
    // Find the user by ID
    const user = await db.User.scope("withHash").findByPk(id);
  
    // Check if the user exists
    if (!user) {
      throw "User not found";
    }
  
    // Check if the current password matches the stored password
    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!passwordMatch) {
      throw "Current password is incorrect";
    }
  
    // Check if the new password is the same as the current password
    if (currentPassword === newPassword) {
      throw "New password cannot be same as current password";
    }
  
    // Check if the new password matches any of the old passwords
    const oldPasswords = await db.OldPassword.findAll({
      where: {
        userId: id
      }
    });
    
    for (const oldPassword of oldPasswords) {
      const oldPasswordMatch = await bcrypt.compare(newPassword, oldPassword.passwordHash);
      if (oldPasswordMatch) {
        throw "You have used this password already please create a new one";
      }
    }
  
    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
  
    // Store the old password in the database
    await db.OldPassword.create({
      userId: id,
      passwordHash: user.passwordHash,
    });
  
    // Update the user's password
    user.passwordHash = newPasswordHash;
    await user.save();
  }

  async function searchUsers({name, email}) {
    let whereClause = {};
  
    if (name) {
      const nameClause = {
        [Op.or]: [
          {firstname: {[Op.like]: `%${name}%`}},
          {lastname: {[Op.like]: `%${name}%`}},
        ],
      };
      whereClause = {...whereClause, ...nameClause};
    }
  
    if (email) {
      whereClause.email = {[Op.like]: `%${email}%`};
    }
  
    if (!name && !email) {
      return await getprofile();
    } else {
      return await db.User.findAll({where: whereClause});
    }
  }

  async function updateUserRole(adminId, userId, newRole) {
    const field = "Role"; // Specify the field being updated
    const user = await getUser(userId);
  
    // Update user role
    user.role = newRole;
    await user.save();
  
    // Create entry in Updated table
    await db.Updated.create({
      adminId,
      userId,
      Field: field,
      value: newRole,
      updatedAt: new Date(),
    });
  }
  
  async function updatePermission(adminId, userId, changePermission) {
    const field = "Permission"; // Specify the field being updated
    const user = await getUser(userId);
  
    // Update user permission
    user.hasPermission = changePermission;
    await user.save();
  
    // Create entry in Updated table
    await db.Updated.create({
      adminId,
      userId,
      Field: field,
      value: changePermission,
      updatedAt: new Date(),
    });
  }

  async function deactivate(id) {
    const user = await getUser(id);

    // Set isactive to 0 and set datedeactivated to current date
    user.activestatus = false;
    user.datedeactivated = new Date(); // This will set the current date and time

    // Save the updated user
    await user.save();
}

async function reactivate(id) {
  const user = await getUser(id);

  // Set isactive to 0 and set datedeactivated to current date
  user.activestatus = true;
  user.datereactivated = new Date(); // This will set the current date and time

  // Save the updated user
  await user.save();
}