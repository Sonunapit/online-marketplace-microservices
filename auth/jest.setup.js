require("dotenv").config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

module.exports = {

  startDB: async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
  },

  stopDB: async () => {

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    if (mongoServer) {
      await mongoServer.stop();
    }

  },

  clearDB: async () => {

    if (mongoose.connection.readyState === 1) {

      const collections = mongoose.connection.collections;

      for (const key in collections) {
        await collections[key].deleteMany({});
      }

    }

  }

};
