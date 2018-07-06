const {r, dbConfig, onConnect} = require('./config');
/**
 * Setup the RethinkDB environment.
 *  --create the realtime database if it doesn't exist
 *  --create the messages and users tables if they don't exist
 */
module.exports.setup = async function () {
    createDatabase(dbConfig.blocks.database)
        .then(createDatabase(dbConfig.transactions.database))
        .then(createTables(dbConfig.blocks.database, dbConfig.blocks.tableName))
        .then(createTables(dbConfig.transactions.database, dbConfig.transactions.tableName));
};

module.exports.teardown = async function () {
    dropDatabase(dbConfig.blocks.database)
        .then(dropDatabase(dbConfig.transactions.database));
};

async function createDatabase(database) {
	onConnect(function (err, connection) {
		//if (err) throw err;
		r.dbCreate(database).run(connection, function (err) {
			if (err) {
				console.log('---->Database \'%s\' already exists (%s:%s)\n%s', database, err.name, err.msg, err.message);
                connection.close(); // Prevents Connection Leakage		
                return (err);
            }
			else {
				console.log('---->Database \'%s\' created', database);
            }
            
            connection.close(); // Prevents Connection Leakage
            return;		
        });
    })
}

async function createTables(database, tableName) {
    onConnect(function (err, connection) {
		//if (err) throw err;
        r.db(database).tableCreate(tableName).run(connection, function (err, result) {
            if (err) {
                console.log('---->Table \'%s\' already exists (%s:%s)\n%s', tableName, err.name, err.msg, err.message);
                connection.close(); // Prevents Connection Leakage		
                return (err);
            }
            else {
                console.log('---->Table \'%s\' created', tableName);
            }				
            
            connection.close(); // Prevents Connection Leakage 		
            return;
        });
    })
}

async function dropDatabase(database) {
    onConnect(function (err, connection) {
		//if (err) throw err;
		r.dbDrop(database).run(connection, function (err) {
			if (err) {
				console.log('---->Database \'%s\' does not exist (%s:%s)\n%s', database, err.name, err.msg, err.message);
			}
			else {
				console.log('---->Database \'%s\' dropped', database);
			}
            connection.close(); // Prevents Connection Leakage
            return;
		});		
	});
}
  

  