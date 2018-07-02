const {r, connection, dbConfig, onConnect} = require('./config');

/**
 * Subscribe to a realtime feedback connection to receive notification of new Blocks
 */
module.exports.registerRealtimeBlockFeed = function (callback) {
    console.log("DB---->registerRealtimeBlockFeed");
    onConnect(function (err, connection) {
      if (err) throw err;
      r.db('blocks').table('headers').changes().run(connection, function (err, cursor) {
        if (err) throw err;
        cursor.each(function (err, row) {
          if (err) throw err;
          console.log("DB---->registerRealtimeBlockFeed pushing....");
          callback(row.new_val.block.header.height);
        });
      });
    });
  };
  
  /**
   * Subscribe to a realtime feedback connection to receive notification of new Transactions
   */
  module.exports.registerRealtimeTransactionFeed = function (callback) {
    console.log("DB---->registerRealtimeTransactionFeed");
    onConnect(function (err, connection) {
      if (err) throw err;
      r.db('transactions').table('transactions').changes().run(connection, function (err, cursor) {
        if (err) throw err;
        cursor.each(function (err, row) {
          if (err) throw err;
          console.log("DB---->registerRealtimeTransactionFeed pushing....");
          callback(row.new_val);
        });
      });
    });
  };
