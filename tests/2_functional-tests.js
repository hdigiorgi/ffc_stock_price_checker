/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var likes = require('../likes');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      this.timeout(8000);

      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.exists(res.body)
          assert.exists(res.body.stockData)
          const stockData = res.body.stockData;
          assert.isString(stockData.stock)
          assert.strictEqual(stockData.stock, 'goog')
          assert.isAbove(stockData.price, 0)
          assert.isAtLeast(stockData.likes, 0)
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        likes.deleteLikes('goog').then(_ => {
          chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end(function(err, res){
            const stockData = res.body.stockData;
            assert.isAbove(stockData.price, 0)
            assert.isAtLeast(stockData.likes, 1)
            done();
          });
        })
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'goog', like: true})
          .end(function(err, res){
            const stockData = res.body.stockData;
            assert.isAbove(stockData.price, 0)
            assert.isAtLeast(stockData.likes, 1)
            done();
          });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['goog', 'amd']})
          .end(function(err, res){
            const stockData = res.body.stockData;
            assert.isArray(stockData)
            assert.isAbove(stockData[0].price, 0)
            assert.isAbove(stockData[1].price, 1)
            assert.strictEqual(stockData[0].stock, 'goog')
            assert.strictEqual(stockData[1].stock, 'amd')
            done();
          });
      });
      
      test('2 stocks with like', function(done) {
        Promise.all([likes.deleteLikes('goog'), likes.deleteLikes('amd')]).then(_ => {
          chai.request(server)
            .get('/api/stock-prices')
            .query({stock: ['goog', 'amd']})
            .end(function(err, res){
              const stockData = res.body.stockData;
              assert.isArray(stockData)
              assert.isAbove(stockData[0].price, 0)
              assert.isAbove(stockData[1].price, 1)
              assert.strictEqual(stockData[0].stock, 'goog')
              assert.strictEqual(stockData[1].stock, 'amd')
              assert.equal(stockData[0].rel_likes, 0)
              assert.equal(stockData[1].rel_likes, 0)
              done();
            });
        })
      });
      
    });

});
