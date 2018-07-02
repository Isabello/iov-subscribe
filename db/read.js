const {r, connection, dbConfig, onConnect} = require('./config');
/**
 * Retrieve Block for a query
 */
module.exports.getBlocks = function (data, callback) {
	console.log('DB---->getBlocks %s', data.height);
	r.connect(connection, function (err, connection) {
		if (err) throw err;
  
		r.db(dbConfig.blocks.database).table(dbConfig.blocks.tableName).filter(
			{'block': {'header':{ 'height': parseInt(data.height)}}}
		).run(connection, function (err, cursor) {
			if (err) throw err;
  
			cursor.next(function (err, row) {
				console.log('Row Result: ' + JSON.stringify(row.block.header.height, null, 2));
  
				callback(null, row);
			});
			connection.close();
		});
	});
};
  
/**
 * Retrieve Transaction history for a query
 */
module.exports.getTransactionHistory = function (data, callback) {
	console.log('DB---->getTransactions %s', data);  
	onConnect(function (err, connection) {
		if (err) throw err;
  
		r.db(dbConfig.transactions.database).table(dbConfig.transactions.tableName)
			.filter(
				{'parsed': {'sendMsg':{ 'src': data}}})
			.orderBy(r.desc('height')).run(connection, function (err, cursor) {
				if (err) throw err;
				cursor.each(function (err, row) {
					console.log('Row Result: ' + JSON.stringify(row.parsed, null, 2));
  
					callback(null, row);
				});
				connection.close();
			});
	});
};