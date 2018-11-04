const util = require('util');            // Deep inspection of objects
var request = require("request");

var authToken = 'Bearer eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..1qPpXbUbZM-ZcrfgXxD2qw.iOjTMCz87LfBqTwlqWY-ou8x2FNuMxoqnx6bV1v6nGSd4URYPietlOMFaD6Ge7s5gsUkGzEZpWI5ZR226tO7xd50BOVQm4t7JGkfy60WbaA__0udHfaiYd0XCQHTRi0GEll_u9rVRxJVbdr6Lo-4IyxHs3tMx8xz_RIyQVSdCFT4mP1vh7KHoQ8d_azUgRpVd-9J2ZItRagHsrUfCqhjwLEIjHNEbhj0QRY9D4Lq10nXbrURU401CaWU561CXhAZWToAY6kc3DpP5r5MKXcJjulPmVLips4D4KRA9NM49nY8DAEHLg2WhX9RdJkPIVZtz8WQjXPr5li3WSzehvNNAV9GB_eLwWnFStz6MEXhaQUsP4THJy5Zav3w_NFYRreYqo5LNy825CHhRP0P3h1rX2w8la-41t2XZo3xZg-2_hPiASH7i4sFj8zjukzzrBBbYbQY2Lq1SLjxFa0mSUGt738kT4lf4aV23KyEj3PeNesT6jIOBkvElyhUCwMf5M0zUP1DDaF_W_jadrlRaeBCQZ3K2X0N2EOCwmws7qfHivJvTsSkQTRUIVo0ARzIkl8zX-SCYt06ZFuq0k1tBDJ5Lh0wEc3ZQeoXUQzSKJwc6DnbxFaH6KBT0V7H5A0GIZ05kF8nYK-brWWwSiR_MvHiodiWxaR3wV5Xz_elbVeAtjDPFPutj-yXqMVysbcVGdvjP411NOLkbpusFCyBPxwmTgMQDYTTsD9Y1zwpDJrrfXnxeQTk_bJSzKvd_ZrHT5CbWuralI2QGxyoDalMdHGxVhaIqkn5byhq9lDWXbQnAEs.CaIg9vaLlyG2uMhKk6E2hA';
var MerchantNameParam= 'Chicken-Fila';
var TransactionDateParam = '2018-10-02';
var TransactionTypeParam = 'Food';
function getOptions(MerchantNameParam, TransactionDateParam, TransactionTypeParam) {
  var options = { method: 'POST',
    url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/193514839712279/invoice',
    qs: { minorversion: '25' },
    headers:
     { 'clientID':  'Q0HY9epaqSa8F5DXSWIPxlbNLvMHDt83M9YafPCnNKNuoaSYav',
       'ClientSecret':  '8FjQi3ddlJEYhYzltRaA7aYu2vqHWj8JtW39NRml',
       'Authorization': authToken,
       'cache-control': 'no-cache',
       'Content-Type': 'application/json',
       Accept: 'application/json',
       'User-Agent': '{{UserAgent}}' },
    body:
     { Line:
        [ { Amount: 61,
            DetailType: 'SalesItemLineDetail',
            SalesItemLineDetail: { ItemRef: { value: '1', name: 'test custom field' } } } ],
       CustomerRef: { value: '58' },
       CustomField:
        [ { DefinitionId: '1',
            Name: 'MerchantName',
            Type: 'StringType',
            StringValue: MerchantNameParam },
          { DefinitionId: '2',
            Name: 'TransactionDate',
            Type: 'StringType',
            StringValue: TransactionDateParam },
          { DefinitionId: '3',
            Name: 'TransactionType',
            Type: 'StringType',
            StringValue: TransactionTypeParam } ] },
    json: true };
  return options;
}

var options = getOptions(MerchantNameParam, TransactionDateParam, TransactionTypeParam);
request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body);
  var invoiceId = '153';
  if(body && body['Invoice'] && body['Invoice']['Id']) {
    invoiceId = body['Invoice']['Id'];
  }
  // var invoiceId = body['Invoice']['Id'];
  console.log(invoiceId);
  // console.log(body);
});
