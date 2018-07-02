var DB = require('../db/db.js');
const { client, bov } = require('../server');

const db = new DB();

function saveBlock(o) {
	parseTxFromBlock(o);
	db.saveHeader(o);
	return o;
}

function saveTransaction(o) {
	db.saveTransaction(o);
}

function parseTxFromBlock(o) {
	if (o === undefined || o.block.data.txs === null) {
		return;
	}
	// FIXME: This only works for blocks with one transaction
	let data = { 'height': o.block.header.height, 'tx': {} };
	let tx = o.block.data.txs[0];
	data.tx = tx;
	client.parseSubscribedTx(data, bov.app.Tx).then(saveTransaction);
}

exports.saveBlock = saveBlock;