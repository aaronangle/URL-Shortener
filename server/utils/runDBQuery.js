const db = require('../db/connection');

// promisify the db query operation
module.exports = function (sql, params) {
  return new Promise(function (resolve, reject) {
    db.query(sql, params, (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};
