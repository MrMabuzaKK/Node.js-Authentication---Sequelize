const User = require('../models/User');

async function getUserByEmail(email) {
  try {
    const userRecord = await User.findOne({ where: {email} });
    console.info('User record found', userRecord);

    return userRecord;
  } catch(error) {
    console.error('Error occurred while retrieving user by email');
    throw error;
  }
}

async function getUserById(id) {
  try {
    const userRecord = await User.findByPk(id);
    console.info('User record found', userRecord);

    return userRecord;
  } catch(error) {
    console.error('Error occurred while retrieving user by id');
    throw error;
  }
}

async function createUser(userObj) {
  return await User.create(userObj);
}

module.exports = {
  getUserById,
  getUserByEmail,
  createUser
}