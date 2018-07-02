/* eslint-env node, mocha */
const expect = require('chai').expect;
const setup = require('../../setup');

describe('db/setup.js', () => {
    
	describe('function', () => {   

		describe('setup', () => {
			it('should not throw', (done) => {
				expect(setup.setup(done())).to.not.throw;
				return;
			});
		});  
        
		describe('teardown', () => {
			it('should not throw', (done) => {
				expect(setup.teardown()).to.not.throw;
				return done();
			});
		});    
	});
});