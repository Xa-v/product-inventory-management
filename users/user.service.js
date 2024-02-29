const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    deactivate,
    reactivate,
    delete: _delete,
    getByUsername
    
};

async function getByUsername(username) {
    const user = await db.User.findOne({ where: { userName: username } });
    return user;
}

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
  
    const user = new db.User(params);
    user.isactive = '1';
   
    // has password
    user.passwordHash = await bcrypt.hash(params.password, 10);

    // save user
    await user.save();
}

async function update(id, params) {
    const user = await getUser(id);

    // validate
  

    // hash password if it was entered
    if (params.password) {
        params.passwordHash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();
}
async function deactivate(id) {
    const user = await getUser(id);

    // Set isactive to 0 and set datedeactivated to current date
    user.isactive = '0';
    user.datedeactivated = new Date(); // This will set the current date and time

    // Save the updated user
    await user.save();
}

async function reactivate(id) {
    const user = await getUser(id);

    // Set isactive to 0 and set datedeactivated to current date
    user.isactive = '1';
    user.datereactivated = new Date(); // This will set the current date and time

    // Save the updated user
    await user.save();
}


async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

