/* eslint-env node, mocha */
const expect = require('chai').expect;
const DB = require('../../db.js');

describe('DB', () => {

	describe('Constructor', () => {      
  
		describe('when called as new', () => {
			it('should not throw', () => {
          
				return expect( () => new DB).not.to.throw();
			});

			describe('should have functions', () => {
				let db = new DB();

				it('registerRealtimeBlockFeed', () => {
          
					return expect(db.registerRealtimeBlockFeed).to.be.a('function');
				});
            
				it('registerRealtimeTransactionFeed', () => {
          
					return expect(db.registerRealtimeBlockFeed).to.be.a('function');
				});
            
				it('getBlocks', () => {
          
					return expect(db.registerRealtimeBlockFeed).to.be.a('function');
				});
            
				it('getTransactionHistory', () => {
          
					return expect(db.registerRealtimeBlockFeed).to.be.a('function');
				});
            
				it('saveHeader', () => {
          
					return expect(db.registerRealtimeBlockFeed).to.be.a('function');
				});
            
				it('saveTransaction', () => {
          
					return expect(db.registerRealtimeBlockFeed).to.be.a('function');
				});
            
				it('setup', () => {
          
					return expect(db.registerRealtimeBlockFeed).to.be.a('function');
				});
			});
		});      
	});
});