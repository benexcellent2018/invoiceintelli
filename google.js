'use strict';

// Set up auth
//export GOOGLE_APPLICATION_CREDENTIALS="./thermal-beach-200005-9887a61c82fc.json"

const vision = require('@google-cloud/vision');
// const util = require('util');            // Deep inspection of objects
// Creates a client
const clientGoogle = new vision.ImageAnnotatorClient();
const fileName = './receipt2.jpg';
// const fileName = 'https://api.box.com/2.0/files/343825971204/content?access_token=mETSm0F7zWJixgJU2OlqJLG9GF8IEdKW';
clientGoogle.textDetection(fileName)
    .then(results => {
      console.log(results);
      const detections = results[0].textAnnotations;
      console.log(detections);
      var gResult = {name:'', date:'',amount:''};
      detections.forEach(text => processText(text, gResult));
      console.log(gResult);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

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
    // console.log(data.length);
    for (let i = 0; i < arr.length; i++) {
      //Print each iteration to the console
      if (arr[i].includes('Restaurant')){
        name = arr[i];
      }
      if (arr[i].includes('Pharmacy')) {
        name = arr[i].substring(0, 15);
      }
      if (arr[i].includes('Grill')) {
        name = arr[i];
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
    console.log(name);
    console.log(date);
    console.log(amount);
  }
}
