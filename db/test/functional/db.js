/* eslint-env node, mocha */
const DB = require('../../db.js');
const expect = require('chai').expect;
const {transaction} = require('./fixtures');

describe('DB class', () => {
    let db;

    before(done => {
        db = new DB();
        console.log('RethinkDB library initialized');
        done();
    });

    // after(done => {
    //     db.teardown();
    //     console.log('RethinkDB tables dropped');
    //     done();
    // });
    
    describe('#setup', () => {



        it('should not throw', async () => {
            const result = await db.setup()
            expect(result).to.be.undefined;
            return;
        });
    });  

    describe.skip('#saveTransaction', () => {
        beforeEach(done => {
            db.setup();
            console.log('RethinkDB tables initialized');
            done();
        });

        afterEach(done => {
            db.teardown();
            console.log('RethinkDB tables dropped');
            done();
        });

        describe('when given an object', () => {
            it('should not throw', async (done) => {
                const saveTransaction = await db.saveTransaction(transaction, done);
                expect(saveTransaction).to.not.throw;  
                return;              
            });
        });
    });
});