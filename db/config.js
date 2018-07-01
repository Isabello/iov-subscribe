const r = require('rethinkdb');

const connection = {host: '192.168.56.101', port: 28015};
const dbConfig = {blocks: {database: 'blocks', tableName: 'headers'},
                        transactions: {database: 'transactions', tableName: 'transactions'}};
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

/**
 * Retrieve Block  for a new connection.
 */
module.exports.getBlocks = function (data, callback) {
  console.log("DB---->getBlocks %s", data.height);
  r.connect(connection, function (err, connection) {
    if (err) throw err;

    r.db('blocks').table('headers').filter(
      {'block': {'header':{ 'height': parseInt(data.height)}}}
	  ).run(connection, function (err, cursor) {
      if (err) throw err;

    	cursor.next(function (err, row) {
      	console.log("Row Result: " + JSON.stringify(row.block.header.height, null, 2));

      	callback(null, row);
      })
      connection.close();
    });
  });
};

module.exports.getTransactionHistory = function (data, callback) {
  console.log("DB---->getTransactions %s", data);

  onConnect(function (err, connection) {
    if (err) throw err;

    r.db('transactions').table('transactions')
      .filter(
        {'parsed': {'sendMsg':{ 'src': data}}})
      .orderBy(r.desc('height')).run(connection, function (err, cursor) {
      if (err) throw err;
    	cursor.each(function (err, row) {
      	console.log("Row Result: " + JSON.stringify(row.parsed, null, 2));

      	callback(null, row);
      })
      connection.close();
    });
  });
};

/**
 * Write block header to db
 */
module.exports.saveHeader = function (header, callback) {
  onConnect(function (err, connection) {
    if (err) throw err;
    r.db('blocks').table('headers').insert(header).run(connection, function (err, result) {
      if (err) {
        console.log("DB---->saveHeader %s:%s\n%s", err.name, err.msg, err.message);
        callback(err);
      }

      //console.log("DB---->saveHeader %s", result);
      connection.close();
    });
  })
};

/**
 * Write transaction to db
 */
module.exports.saveTransaction = function (transaction, callback) {
  onConnect(function (err, connection) {
    if (err) throw err;
    r.db('transactions').table('transactions').insert(transaction).run(connection, function (err, result) {
      if (err) {
        console.log("DB---->saveTransaction %s:%s\n%s", err.name, err.msg, err.message);
        callback(err);
      }

      console.log("DB---->saveTransaction %s", result);
      connection.close()
    });
  })
};


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

function onConnect(callback) {
  r.connect(connection, function(err, connection) {
    if (err) throw err;
    connection['_id'] = Math.floor(Math.random()*10001);
    callback(err, connection);
  });
}
