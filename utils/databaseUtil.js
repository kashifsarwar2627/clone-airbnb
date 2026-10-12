const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const DEFAULT_DB_NAME = 'airbnb';
let _db;

const buildMongoUri = () => {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  return `mongodb://127.0.0.1:27017/${process.env.MONGO_DB_NAME || DEFAULT_DB_NAME}`;
};

const mongoConnect = async (callback) => {
  try {
    let uri = buildMongoUri();
    let client;

    try {
      client = await MongoClient.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
    } catch (localError) {
      console.log('Local MongoDB not available, starting temporary in-memory database...');
      const mongoServer = await MongoMemoryServer.create();
      client = await MongoClient.connect(mongoServer.getUri(), {
        serverSelectionTimeoutMS: 10000,
      });
      uri = mongoServer.getUri();
    }

    _db = client.db(process.env.MONGO_DB_NAME || DEFAULT_DB_NAME);

    if (callback) {
      callback();
    }

    return _db;
  } catch (err) {
    console.log('Error while connecting to Mongo: ', err);
    throw err;
  }
};

const getDB = () => {
  if (!_db) {
    throw new Error('Mongo not connected');
  }
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
