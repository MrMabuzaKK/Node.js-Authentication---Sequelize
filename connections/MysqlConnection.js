
const Sequelize = require("sequelize");
let sequelize;

function getSequelize() {
  if (sequelize) {
    return sequelize;
  }

  sequelize = new Sequelize(process.env.CONNECTION_URI, {logging: false,});

  return sequelize;
}

async function connectToMysql() {
  const sequelize = getSequelize();

  try {
    await sequelize.authenticate();
  } catch(error) {
    console.error('Error occurred while connecting to DB', error);
    throw error;
  }
}

module.exports = {
  connectToMysql,
  getSequelize
}