const redisClient = require('../db/redis');

const readCache = async function (id) {
  return JSON.parse(await redisClient.get(id));
};

const writeCache = async function (id, data, expireTime) {
  await redisClient.set(shortURL, JSON.stringify(data), {
    EX: expireTime, //24 hours in seconds
    NX: true,
  });
};
// promisify the db query operation
module.exports = { readCache, writeCache };
