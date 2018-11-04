const util = require('util');            // Deep inspection of objects
var request = require("request");

var authToken = 'Bearer eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..cbmj0Jv2QaM2soqhDw97CQ.741Ub9IP3VJ9VsM5wmfok2Lm9MbtYJ7VkTOhe_6HrGE2NS2U685Q2ejUL9ZOq2Pq-Tu2eQvO3C2Lqa2zLgMfQ3DLm1F54n-vb4M8vXNs06q6Bs6rLH_D6wwUubigYrFeB0zgEP3we3xn6wWYOQY76k78FJBoBdsMMcFEWG8FCXl-pj-ylO35EFHQO8vYzZByDxHergwvts2xmGfcImqtnqsCyYk9fToGmJFHMDhwr-gBx8H0hlMGKO2fmMxdaqBJHYA0hCGic60uvRhuRDOMgvAkUoSEHk46-9HunVmqPSkz9qPJQQSQ16qeEbYf6eXQ_cUYTLnc1GzLYHUilyK-taj2rojVa9a-_W8v8CdowBJr6m_iLVs7Sr8U-kWqlC1YjpPnoB0m5ARDSr6I8XGfuDQ2MrRvvDQIehk_MFu_o8lL-0wUQ-FhtWTR2vHkt6cDog6twN_Mpby_-I_FYWZfrhZH3jYSQgaexsEpdc1lFVvfigK5ytKi6x1VjfLlVnRlxep5wWprJSdXNt1HtTjQ0wDAhKAUAfE2izeOH1AIaZnWID2ciSTqtP46_ojdUw42IhnBbqioIFV4HyxPbJLaxlLeAbIZ5wiDBpReg0ZYDlFtopZ748kWv5Qj_Af8PkumiwySG2AGaWcWSLYOC9f0kuz-yKUCaDol4M52ibuRM48w8xITNArXF6bvjIiiqS8Tq0OPtbu94RHSWX6zEql3CRmQBTn2esZQ9vmT3VFS6ZY3RIT75xpSL3tLQdi8FuL3HoBpxgn66Err6xSIpmuZDIcz8UjlbjdVmAUr_z2jOYc.XTn_WxVvfHcRDvLK_4KaUA';
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
