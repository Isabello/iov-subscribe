const app = require('express')();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const DB = require('./db/db.js');
const weave = require('weave/lib/weave.node.js');
const bovJSON = require('./bov/bov.json');
const bov = weave.loadJSON(bovJSON);

// Connects to a Tendermint Instance
let tendermintHost = 'ws://192.168.56.101:46657';
const client = new weave.Client(tendermintHost); 

// Exports Generated by VS Code
exports.bov = bov;
exports.io = io;
exports.client = client;

// Setup Helpers / constants
const { register } = require('./helpers/registerChangeFeeds');
const { saveBlock } = require('./helpers/saveBlock');

//setup RethinkDB environment
const db = new DB();
db.setup(register);

/// Subscriptions
// Subscribe to block headers
client.subscribeHeaders(saveBlock);

// If we only want to subscribe to TX, uncomment below
//parseTx = o => client.parseSubscribedTx(o.TxResult,bov.app.Tx).then(saveTransaction);
// client.subscribeAllTx(parseTx);

// Set pug to view engine and configure default path
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//setup the routes
app.get('/', (req, res) => {
	res.render('homepage', {
	});
});

//setup socketIO to listen for client messages
io.on('connection', function (socket) {

	// Block History
	// request:blockHistory
	// response:blockHistory
	socket.on('request:blockHistory', function (data) {
		console.log('Socket---->request:block %s', JSON.stringify(data, null, 2));
		db.getBlocks({height: data.height}, function (err, result) {
			if (err) {
				console.log('Error getting data:  %s', err);
				return;
			}

			console.log('Block Retrieved:  %s', result);
			// Broadcasts block history to all users
			io.emit('response:blockHistory', result);
			return;
		});
	});

	// TransactionHistory
	// request:TransactionHistory
	// response:TransactionHistory
	socket.on('request:TransactionHistory', function (data) {
		console.log('Socket---->request:history %s', JSON.stringify(data, null, 2));
		db.getTransactionHistory(data.address, function (err, result) {
			if (err) {
				console.log('Error getting data:  %s', err);
				return;
			}

			console.log('History Retrieved:  %s', result);
			// Return User Data only to the caller.
			io.to(socket.id).emit('response:TransactionHistory', result);
			return;
		});
	});
});

//the last step:  listen for requests
server.listen(3000, function () {
	console.log('listening on *:3000');
});exports.console = console;
exports.console = console;

