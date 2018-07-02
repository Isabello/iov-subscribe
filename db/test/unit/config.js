/* eslint-env node, mocha */
const expect = require('chai').expect;
const config = require('../../config');


describe('config', () => {
    
	describe('connection', () => {      
  
		describe('contents', () => {
			it('should be an object', () => {
				expect(config.connection).to.be.a('object');
				return;
			});
            
			it('with two properties - host and port', () => {
				expect(config.connection.host).to.be.a('string');
				expect(config.connection.port).to.be.a('number');
				return;
			});
		});      
	});

	describe('dbConfig', () => {      
  
		describe('contents', () => {
			it('should be an object', () => {
				expect(config.dbConfig).to.be.a('object');
				return;
			});
            
			it('with two objects - blocks and transactions', () => {
				expect(config.dbConfig.blocks).to.be.a('object');
				expect(config.dbConfig.transactions).to.be.a('object');
				return;
			});

			it('blocks should have database and tableName', () => {
				expect(config.dbConfig.blocks.database).to.be.a('string');
				expect(config.dbConfig.blocks.tableName).to.be.a('string');
				return;
			});
			it('transactions should have database and tableName', () => {
				expect(config.dbConfig.transactions.database).to.be.a('string');
				expect(config.dbConfig.transactions.tableName).to.be.a('string');
				return;
			});
		});     
	});

	// TODO: Find a way to test this
	describe.skip('onConnect', () => { 
		describe('when called', () => {
			it('should connect to RethinkDB', () => {
				config.onConnect();
				return;
			});
		});      
	});
});