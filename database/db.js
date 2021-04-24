const Sequelize = require("sequelize");
const mysql = require("mysql2/promise");
const config = require("../config/default.json");

module.exports = db = {};

const initialize = async () => { 
  const host = config.HOST;
  const port = config.PORT;
  const user = config.USER;
  const password = config.PASSWORD;
  const database = config.DATABASE;

  const wait = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    });
  }

  let second = 5;
  let retryTime = 2;

  for (let i = 0; i < retryTime; ++i) {
  	try {
  	  let connection = await mysql.createConnection({ host: host, port: port, user: user, password: password });
  	  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
      break;
  	} catch (err) {
  	  console.log(`[${i + 1}/${retryTime}] Database not ready yet, wait for ${second} seconds`);
      await wait(second * 1000);
  	}
  }

  const sequelize = new Sequelize(database, user, password, {
  	dialect: "mysql",
    host: host
  });

  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  await sequelize.sync({ force: true });

  console.log('Connected to Database!');
}

db.initialize = initialize;


