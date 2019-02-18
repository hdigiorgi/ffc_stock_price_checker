/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const stock = require('../stock')

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      const stockIds = req.query.stock;
      const addLike = (req.query.like && req.query.like.toLowerCase() == 'true') || false;
      const senderIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const result = stock(stockIds, addLike, senderIp);
      result.then(
        data => {
          res.json({stockData: data})
        },
        error => {
          res.status(500).json({error: 'some internal error'})
        }
      )
    });
    
};
