const {r, dbConfig, onConnect} = require('./config');
/**
 * Write block header to db
 */
module.exports.saveHeader = async function (header, callback) {
	onConnect(function (err, connection) {
		if (err) throw err;
		r.db(dbConfig.blocks.database).table(dbConfig.blocks.tableName).insert(header).run(connection, function (err, result) {
			if (err) {
				console.log('DB---->saveHeader %s:%s\n%s', err.name, err.msg, err.message);
				callback(err);
			}
  
			console.debug('DB---->saveHeader %s', result);
			connection.close();
		});
	});
};
  
/**
   * Write transaction to db
   */
module.exports.saveTransaction = async function (transaction) {
	onConnect(function (err, connection) {
		if (err) throw err;
		r.db(dbConfig.transactions.database).table(dbConfig.transactions.tableName).insert(transaction).run(connection, function (err, result) {
			if (err) {
				console.log('DB---->saveTransaction %s:%s\n%s', err.name, err.msg, err.message);
			}
  
			console.debug('DB---->saveTransaction %s', result);
			connection.close();
		});
	});
};