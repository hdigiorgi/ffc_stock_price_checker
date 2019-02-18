const fetch = require("node-fetch");

function getApiUrl(stockSymbol) {
    const symbol = stockSymbol.replace(/[^A-Za-z0-9\.]/g, "")
    return `https://api.iextrading.com/1.0/stock/${symbol}/batch?types=quote`
}

function makeApiCall(stockSymbol) {
    const url = getApiUrl(stockSymbol)
    return fetch(url).then(response => response.json())
}

function getPrice(stockSymbol) {
    return makeApiCall(stockSymbol).then(
        json => json.quote.latestPrice,
        _ => -1
    );
}

module.exports = getPrice;