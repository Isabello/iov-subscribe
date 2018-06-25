var r = require('rethinkdb');
var dbHost = '192.168.56.101' // Use me instead....
/**
 * Setup the RethinkDB environment.
 *  --create the realtime database if it doesn't exist
 *  --create the messages and users tables if they don't exist
 */
module.exports.setup = function (callback) {
  r.connect({host: '192.168.56.101', port: 28015}, function (err, connection) {
    //if (err) throw err;
    var db_name = 'blocks';
    r.dbCreate(db_name).run(connection, function (err, result) {
      if (err) {
        console.log("---->Database '%s' already exists (%s:%s)\n%s", db_name, err.name, err.msg, err.message);
      }
      else {
        console.log("---->Database '%s' created", db_name);
      }

      //create block headers table
      r.db(db_name).tableCreate('headers').run(connection, function (err, result) {
        if (err) {
          console.log("---->Table 'header' already exists (%s:%s)\n%s", err.name, err.msg, err.message);
        }
        else {
          console.log(JSON.stringify(result, null, 2));
        }
      });
    });

    db_name = 'transactions';
    r.dbCreate(db_name).run(connection, function (err, result) {
      if (err) {
        console.log("---->Database '%s' already exists (%s:%s)\n%s", db_name, err.name, err.msg, err.message);
      }
      else {
        console.log("---->Database '%s' created", db_name);
      }

      //create transactions table
      r.db(db_name).tableCreate('transactions').run(connection, function (err, result) {
        if (err) {
          console.log("---->Table 'transactions' already exists (%s:%s)\n%s", err.name, err.msg, err.message);
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
  r.connect({host: '192.168.56.101', port: 28015}, function (err, connection) {
    if (err) throw err;

    r.db('blocks').table('headers').filter(
      {'block': {'header':{ 'height': parseInt(data.height)}}}
	  ).run(connection, function (err, cursor) {
      if (err) throw err;

    	cursor.next(function (err, row) {
      	console.log("Row Result: " + JSON.stringify(row.block.header.height, null, 2));
        connection.close();
      	callback(null, row);
    	})
    });
  });
};

module.exports.getTransactionHistory = function (data, callback) {
  console.log("DB---->getTransactions %s", data.address);
  r.connect({host: '192.168.56.101', port: 28015}, function (err, connection) {
    if (err) throw err;

    r.db('transactions').table('transactions').orderBy(r.desc(r.row('TxResult')('height'))).run(connection, function (err, cursor) {
      if (err) throw err;
    	cursor.each(function (err, row) {
      	//console.log("Row Result: " + JSON.stringify(row.parsed, null, 2));
        connection.close();
      	callback(null, row);
    	})
    });
  });
};

/**
 * Write block header to db
 */
module.exports.saveHeader = function (header, callback) {
  var connection = null;
  r.connect({host: '192.168.56.101', port: 28015}, function (err, connection) {
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
  var connection = null;
  r.connect({host: '192.168.56.101', port: 28015}, function (err, connection) {
    if (err) throw err;
    r.db('transactions').table('transactions').insert(transaction).run(connection, function (err, result) {
      if (err) {
        console.log("DB---->saveTransaction %s:%s\n%s", err.name, err.msg, err.message);
        callback(err);
      }

      //console.log("DB---->saveTransaction %s", result);
      connection.close()
    });
  })
};


/**
 * Subscribe to a realtime feedback connection to receive notification of new Blocks
 */
module.exports.registerRealtimeBlockFeed = function (callback) {
  console.log("DB---->registerRealtimeBlockFeed");
  r.connect({host: '192.168.56.101', port: 28015}, function (err, connection) {
    if (err) throw err;
    r.db('blocks').table('headers').changes().run(connection, function (err, cursor) {
      if (err) throw err;
      cursor.each(function (err, row) {
        if (err) throw err;
        console.log("DB---->registerRealtimeBlockFeed pushing....");
        callback(row);
      });
    });
  });
};

/**
 * Subscribe to a realtime feedback connection to receive notification of new Transactions
 */
module.exports.registerRealtimeTransactionFeed = function (callback) {
  console.log("DB---->registerRealtimeTransactionFeed");
  r.connect({host: '192.168.56.101', port: 28015}, function (err, connection) {
    if (err) throw err;
    r.db('transactions').table('transactions').changes().run(connection, function (err, cursor) {
      if (err) throw err;
      cursor.each(function (err, row) {
        if (err) throw err;
        console.log("DB---->registerRealtimeTransactionFeed pushing....");
        callback(row);
      });
    });
  });
};
