var request = require("request");

var options = { method: 'POST',
  url: 'https://sandbox-quickbooks.api.intuit.com/v3/company/193514839712279/invoice',
  qs: { minorversion: '25' },
  headers:
   { 'clientID':  'Q0HY9epaqSa8F5DXSWIPxlbNLvMHDt83M9YafPCnNKNuoaSYav',
     'ClientSecret':  '8FjQi3ddlJEYhYzltRaA7aYu2vqHWj8JtW39NRml',
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
          StringValue: 'Chicken-Fila' },
        { DefinitionId: '2',
          Name: 'TransactionDate',
          Type: 'StringType',
          StringValue: '2018-10-02' },
        { DefinitionId: '3',
          Name: 'TransactionType',
          Type: 'StringType',
          StringValue: 'Food' } ] },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
