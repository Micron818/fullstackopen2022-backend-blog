require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");

const url = new URL(process.env.TEST_MONGODB_URI);
const instance = {
  ip: url.hostname,
  port: parseInt(url.port)||0,
};

const startInMemoryMongoDB = async () => {
  // This will create an new instance of "MongoMemoryServer" and automatically start it
  const mongod = await MongoMemoryServer.create({ instance: instance });

  const uri = mongod.getUri();
  console.log("mongo memory server started: ", uri);

  // The Server can be stopped again with
  // await mongod.stop();
};

module.exports = { startInMemoryMongoDB };
