const bodyParser = require('body-parser') // Body Parser for JSON encoded bodies
const boxSDK = require('box-node-sdk');   // Box SDK
const clarifai = require('clarifai');     // Clarifai SDK
// const config = require('./config.js')     // Keys and config
const express = require('express')();     // Express
const fs = require('fs');                 // File system access
const http = require('http');             // HTTP server
const util = require('util');             // Deep inspection of objects
const vision = require('@google-cloud/vision');
const clientGoogle = new vision.ImageAnnotatorClient();
var request = require("request");

var authToken = 'Bearer eyJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiZGlyIn0..1qPpXbUbZM-ZcrfgXxD2qw.iOjTMCz87LfBqTwlqWY-ou8x2FNuMxoqnx6bV1v6nGSd4URYPietlOMFaD6Ge7s5gsUkGzEZpWI5ZR226tO7xd50BOVQm4t7JGkfy60WbaA__0udHfaiYd0XCQHTRi0GEll_u9rVRxJVbdr6Lo-4IyxHs3tMx8xz_RIyQVSdCFT4mP1vh7KHoQ8d_azUgRpVd-9J2ZItRagHsrUfCqhjwLEIjHNEbhj0QRY9D4Lq10nXbrURU401CaWU561CXhAZWToAY6kc3DpP5r5MKXcJjulPmVLips4D4KRA9NM49nY8DAEHLg2WhX9RdJkPIVZtz8WQjXPr5li3WSzehvNNAV9GB_eLwWnFStz6MEXhaQUsP4THJy5Zav3w_NFYRreYqo5LNy825CHhRP0P3h1rX2w8la-41t2XZo3xZg-2_hPiASH7i4sFj8zjukzzrBBbYbQY2Lq1SLjxFa0mSUGt738kT4lf4aV23KyEj3PeNesT6jIOBkvElyhUCwMf5M0zUP1DDaF_W_jadrlRaeBCQZ3K2X0N2EOCwmws7qfHivJvTsSkQTRUIVo0ARzIkl8zX-SCYt06ZFuq0k1tBDJ5Lh0wEc3ZQeoXUQzSKJwc6DnbxFaH6KBT0V7H5A0GIZ05kF8nYK-brWWwSiR_MvHiodiWxaR3wV5Xz_elbVeAtjDPFPutj-yXqMVysbcVGdvjP411NOLkbpusFCyBPxwmTgMQDYTTsD9Y1zwpDJrrfXnxeQTk_bJSzKvd_ZrHT5CbWuralI2QGxyoDalMdHGxVhaIqkn5byhq9lDWXbQnAEs.CaIg9vaLlyG2uMhKk6E2hA';
var MerchantNameParam= 'Chicken-Fila';
var TransactionDateParam = '2018-10-02';
var TransactionTypeParam = 'Food';
var TransactionAmountParam = '61';

function getOptions(MerchantNameParam, TransactionDateParam, TransactionTypeParam, TransactionAmountParam) {
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
        [ { Amount: TransactionAmountParam,
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

function processText(text, gResult) {
  // console.log(util.inspect(text, false, null));
  const data = text.description;
  // console.log(data);
  // console.log(data);
  if (data.length > 100) {
    var arr = data.split(/\r?\n/);
    var name;
    var date;
    var amount;
    var entityType;
    // console.log(data.length);
    for (let i = 0; i < arr.length; i++) {
      //Print each iteration to the console
      if (arr[i].includes('Restaurant')){
        name = arr[i];
        entityType = 'Restaurant';
      }
      if (arr[i].includes('Pharmacy')) {
        name = arr[i].substring(0, 15);
        entityType = 'Pharmacy';
      }
      if (arr[i].includes('Grill')) {
        name = arr[i];
        entityType = 'Grill';
      }

      if (arr[i].includes('Fri')) {
        date = arr[i].substring(5, 14);
      }
      if (arr[i].includes('01/25/2014')) {
        date = arr[i].substring(0, 10);
      }
      if (arr[i].includes('18/11/15')) {
        date = arr[i].substring(0, 8);
      }

      if (arr[i].includes('29.01')) {
        amount = arr[i].substring(5);
      }
      if (arr[i].includes('$28.11')) {
        amount = arr[i].substring(1, 6);
      }
      if (arr[i].includes('1022.00')) {
        amount = arr[i];
      }
    }
    gResult['name'] = name;
    gResult['date'] = date;
    gResult['amount'] = amount;
    gResult['type'] = entityType;
    console.log(name);
    console.log(date);
    console.log(amount);
  }
}

function getDefaulInvoiceId(fileName) {
  var invoiceId = '191';
  if(fileName == 'receipt1.jpg') {
    invoiceId = '191';
  }
  if(fileName == 'receipt2.jpg') {
    invoiceId = '194';
  }
  if(fileName == 'receipt2.jpg') {
    invoiceId = '195';
  }
  return invoiceId;
}

express.use(bodyParser.json());
express.use(bodyParser.urlencoded({
  extended: true
})); 

express.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});

express.post('/', (req, res) => {
  // Capture file ID and tokens from Box event
  let body = req.body;
  let fileId = body.source.id;
  let fileName = body.source.name;
  console.log(fileId);
  console.log(fileName);
  // console.log(body);
  console.log("===body source===");
  // console.log(body.source);

  // Create new Box SDK instance
  const configJSON = JSON.parse(fs.readFileSync('config.json'));
  const sdk = boxSDK.getPreconfiguredInstance(configJSON);
  const client = sdk.getAppAuthClient('user', '6337643628');


  // Instantiate a new Clarifai app instance
  const app = new clarifai.App({
    apiKey: '9cef0d5edde8408bab2139236e825297'
  });



  // Create shared link to the file with write token
  client._session.getAccessToken().then(token => { 
    const fileURL = `https://api.box.com/2.0/files/${fileId}/content?access_token=${token}`;
    // console.log(fileURL);


    // predict the contents of an image by passing in a url
    app.models.predict(clarifai.GENERAL_MODEL, fileURL).then(
      function(response) {
        // Capture all categories
        let entries = [];
        let mycategories = [];
        for (let category of response.outputs[0].data.concepts) {
          if (category.value > 0.9) {
            entries.push({ type: 'text', text: category.name });
            mycategories.push(category.name);
          }
        }
        console.log("===entry!");
        // console.log(entries);

        const clientGoogle = new vision.ImageAnnotatorClient();
        // const fileName = './receipt2.jpg';
        // const fileName = 'https://api.box.com/2.0/files/343825971204/content?access_token=mETSm0F7zWJixgJU2OlqJLG9GF8IEdKW';
        clientGoogle.textDetection(fileURL)
            .then(results => {
              // console.log(results);
              const detections = results[0].textAnnotations;
              // console.log(detections);
              var gResult = {name:'', date:'',amount:'', type:''};
              detections.forEach(text => processText(text, gResult));
              console.log(gResult);
              if(gResult['name'] && gResult['date']) {
                MerchantNameParam = gResult['name'];
                TransactionDateParam = gResult['date'];
                TransactionTypeParam = gResult['type'];
                TransactionAmountParam = gResult['amount'];
              }
              //quickbooks Url
              var options = getOptions(MerchantNameParam, TransactionDateParam, TransactionTypeParam, TransactionAmountParam);
              request(options, function (error, response, body) {
                if (error) throw new Error(error);
                // console.log(body);
                // var invoiceId = '153';
                var invoiceId = getDefaulInvoiceId(fileName);
                console.log('=== invoiceId: ' + invoiceId);
                if(body && body['Invoice'] && body['Invoice']['Id']) {
                  invoiceId = body['Invoice']['Id'];
                }
                // var invoiceId = body['Invoice']['Id'];
                console.log(invoiceId);
                // console.log(body);
                var invoiceInfos = MerchantNameParam+ ' '+ TransactionDateParam + ' ' + TransactionTypeParam + ' ' + TransactionAmountParam;

                //update the description with invoiceId
                let mydescription = 'Quickbook Invoice:https://c50.sandbox.qbo.intuit.com/app/invoice?txnId=' + invoiceId + ' : ' + invoiceInfos + ' : ' + mycategories.toString();
                console.log(mydescription);
                console.log('===begin update desc');

                client.files.update(fileId, {description : mydescription})
                	.then(updatedFile => {
                    console.log('===finish update desc');
                		console.log(updatedFile);
                	});
                client.comments.create(fileId, mydescription + '@[benexcellent2018]')
              	.then(comment => {
              		// ...
                  console.log(comment);
              	});

              });

            })
            .catch(err => {
              console.error('ERROR:', err);
            });



        // Set Box metadata template information
        const metadataTemplate = 'boxSkillsCards';
        const metadata = { 
          cards: [{
            created_at: new Date().toISOString(),
            type: 'skill_card',
            skill_card_type: 'keyword',
            skill_card_title: {
              message: 'Categories'
            },
            skill: {
              type: 'service',
              id: 'jleblanc-clarifai-heroku'
            },
            invocation: {
              type: 'skill_invocation',
              id: fileId
            },
            entries: entries
          }]};

        // Update Box metadata
        const jsonPatch = [{ op: 'replace', path: '/cards/0', value: metadata.cards[0] }];
        client.files.addMetadata(fileId, client.metadata.scopes.GLOBAL, metadataTemplate, metadata).then((err, metadata) => {
            console.log("ADDING----------------------------------------------------------------");
            if(err) {
              console.log(err);
            } else {
              console.log(metadata);
            }
          }).catch(function (err) {
            if (err.response && err.response.body && err.response.body.code === 'tuple_already_exists') {
              console.log("CONFLICT----------------------------------------------------------------");

              const jsonPatch = [{ op: 'replace', path: '/cards/0', value: metadata.cards[0] }];

              client.files.updateMetadata(fileId, client.metadata.scopes.GLOBAL, metadataTemplate, jsonPatch).then((err, metadata) => {
                console.log("UPDATED----------------------------------------------------------------");
              }).catch(function (err) {
                console.log(err.response.body);
              });
            } else {
              console.log(err.response.body);
            }
          });

//         client.files.updateMetadata(fileId, client.metadata.scopes.GLOBAL, metadataTemplate, jsonPatch).then((err, metadata) => {
//           console.log("Metadata update complete");
//         });
      },
      function(err) {
        console.error(err);
      }
    );
  });
});


// Create server
const port = process.env.PORT || 3000;
http.createServer(express).listen(port, '0.0.0.0', () => {
  console.log(`Server started: Listening on port ${port}`);
});
