const {r, connection, dbConfig, onConnect} = require('./config');
/**
 * Setup the RethinkDB environment.
 *  --create the realtime database if it doesn't exist
 *  --create the messages and users tables if they don't exist
 */
module.exports.setup = function (callback) {
    onConnect(function (err, connection) {
      //if (err) throw err;
      r.dbCreate(dbConfig.blocks.database).run(connection, function (err, result) {
        if (err) {
          console.log("---->Database '%s' already exists (%s:%s)\n%s", dbConfig.blocks.database, err.name, err.msg, err.message);
        }
        else {
          console.log("---->Database '%s' created", dbConfig.blocks.database);
        }
  
        //create block headers table
        r.db(dbConfig.blocks.database).tableCreate(dbConfig.blocks.tableName).run(connection, function (err, result) {
          if (err) {
            console.log("---->Table '%s' already exists (%s:%s)\n%s", dbConfig.blocks.tableName, err.name, err.msg, err.message);
          }
          else {
            console.log(JSON.stringify(result, null, 2));
          }
        });
      });
  
      r.dbCreate(dbConfig.transactions.database).run(connection, function (err, result) {
        if (err) {
          console.log("---->Database '%s' already exists (%s:%s)\n%s", dbConfig.transactions.database, err.name, err.msg, err.message);
        }
        else {
          console.log("---->Database '%s' created", dbConfig.transactions.database);
        }
  
        //create transactions table
        r.db(dbConfig.transactions.database).tableCreate(dbConfig.transactions.tableName)
        .run(connection, function (err, result) {
          if (err) {
            console.log("---->Table '%s' already exists (%s:%s)\n%s", dbConfig.transactions.tableName, err.name, err.msg, err.message);
          }
          else {
            console.log(JSON.stringify(result, null, 2));
          }
        });
      });
  
      connection.close(); // Prevents Connection Leakage
      callback();
    });
  };
  