const r = require('rethinkdb');

const connection = {host: '192.168.56.101', port: 28015};

const dbConfig = {
	blocks: {database: 'blocks', tableName: 'headers'},
	transactions: {database: 'transactions', tableName: 'transactions'}
};
/*
 * 
 * Connection handler for the RethinkDB Connection 
 * 
*/
module.exports.onConnect = function (callback) {
	r.connect(connection, function(err, connection) {
		if (err) throw err;
		connection['_id'] = Math.floor(Math.random()*10001);
		callback(err, connection);
	});
};

module.exports.r = r;
module.exports.connection = connection;
module.exports.dbConfig = dbConfig;