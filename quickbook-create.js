const util = require('util');            // Deep inspection of objects
var request = require("request");

var authToken = 'Bearer eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..1JLUFWBpROXoQQPElhDNzg.1hOH7_DFMPeLD-VVPiRsTR7YWIIH5XI3DnS0y1nC58QlVNEZGOgs-XhovecjGjN5CsFhMT8G-jk9GsXqsweigsaCH8Nvx-MbaG5YwI7uVk4a6CvuimANvvbY65Agiqy-hoM4Yru6vjdULEd5l1G4WCplw5vUtb2qQBL9cY75Kx0-y2vlCGfnHryp2623X8lTRmel_uvz5w9saUQ0lAasWRl4zCAVfRKxfMpxBxfzmVXBouSai8ZXACuUjHDd-9-tHC6qM9F-24b9l4AyfN0M5E4Tk54lwG9LCqHRjXZUrgquzh1hNCFPqQmUXldoIeg4lOxgEh-3RsoYYrtOrHcjJjuXZhbnOxtS_QB-z_HA1E3eNIRA1Um3koOB8aX7Kc4gkKnEu1JROxEDQ-ThLXg5lt_UN39vSoa80j9yuEDV75hcVxItk2qj4hH3gFTJC67q2LydhR4vUQ6fMV8r6PQwmkomYi-by1KAnq-AQid5kwrtSjavw_cTlV6581ek14-ARYA3B_FXIEtzxqmbHcz-t7N6qQVQkquNR44wfiC86aPwdtjrRpvfx-zSOpaJC0YbJXQrcMut4pepk8yaKWhifSphwASgB4yhDxuHMGEbMCEX7qaKz9-bSj61ya-ySgujjYdGPktIGpWQy9KdnAQCw939wv9qJBNXsNkpRqSWcfIBzrCBHlNxSwT-QYMbzItkdMSvqAY5-PMJvxb2o_lHQLDc33YZWwrpva-uMD3OVMuHkDqB8dh3WCaib7nO8ooOX6FnYFj3PhJbNPwbosadSIUL8gXv-aqEX2XEEC7BAtg.fVhzepsh1-sjDIekuPgB6Q';
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
