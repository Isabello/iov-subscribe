const {registerRealtimeBlockFeed, registerRealtimeTransactionFeed} = require('./changefeed');
const {getBlocks, getTransactionHistory} = require('./read');
const {saveHeader, saveTransaction} = require('./write');
const {setup} = require('./setup');


class db  {
	constructor() {
		this.registerRealtimeBlockFeed = registerRealtimeBlockFeed;
		this.registerRealtimeTransactionFeed = registerRealtimeTransactionFeed;
		this.getBlocks = getBlocks;
		this.getTransactionHistory = getTransactionHistory;
		this.saveHeader = saveHeader;
		this.saveTransaction = saveTransaction;
		this.setup = setup;
	}
}

module.exports = db;
