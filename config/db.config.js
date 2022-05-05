/*
 * database for storing image info
 * ref: https://github.com/bezkoder/nodejs-upload-image-mysql.git
 */
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "123456",
  DB: "testdb",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};