'use strict';

// Set up auth
//export GOOGLE_APPLICATION_CREDENTIALS="./thermal-beach-200005-9887a61c82fc.json"

const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();
const fileName = './receipt3.jpg'
client
    .textDetection(fileName)
    .then(results => {
      const detections = results[0].textAnnotations;
      console.log('Text:');
      detections.forEach(text => processText(text));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

function processText(text) {
  const data = text.description;
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
    console.log(name);
    console.log(date);
    console.log(amount);
  }
}
