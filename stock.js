const likes = require('./likes');
const stockPriceApi = require('./stock-price-api');

function getSingleStockData(stock) {
    return Promise.all([
        stockPriceApi(stock),
        likes.getLikeCount(stock)
    ]).then(([price, likes]) => ({stock, price, likes}))
}

function getMultipleStockData(stocks) {
    const twoStocksData = stocks.slice(0,2).map(x => getSingleStockData(x));
    return Promise.all(twoStocksData).then(([stock1, stock2]) => {
        stock1.rel_likes = stock1.likes - stock2.likes;
        stock2.rel_likes = stock2.likes - stock1.likes;
        delete stock1.likes;
        delete stock2.likes;
        return [stock1, stock2]
    })
}

function addLikes(stocks, who) {
    const addProm = stocks.map(stock => likes.addLike(stock, who))
    return Promise.all(addProm)
}

function getData(stocks, like, comeFrom) {
    console.log(like)
    if(Array.isArray(stocks)) {
        if(like) {
            return addLikes(stocks, comeFrom).then(_ => getMultipleStockData(stocks))
        }
        return getMultipleStockData(stocks)
    } else {
        if(like) {
            return addLikes([stocks], comeFrom).then(_ => getSingleStockData(stocks))
        }
        return getSingleStockData(stocks);
    }
}

module.exports = getData