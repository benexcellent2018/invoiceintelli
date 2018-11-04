'use strict';

// Initialize packages
const util = require('util');            // Deep inspection of objects
const boxSDK = require('box-node-sdk');  // Box SDK
const fs = require('fs');                // File system for config

// Fetch config file for instantiating SDK instance
// SAVE YOUR OWN APP CONFIG FILE TO config.json
const configJSON = JSON.parse(fs.readFileSync('config.json'));

// Instantiate instance of SDK using generated JSON config
const sdk = boxSDK.getPreconfiguredInstance(configJSON);

// Create service account client
// const client = sdk.getAppAuthClient('enterprise');
const client = sdk.getAppAuthClient('user', '6337643628');
/****************************************************************
* Create Webhook
****************************************************************/
// CREATE WEBHOOK
const fileId = '57362387502';
const notificationURL = 'https://invoiceintelli.herokuapp.com/';

client.webhooks.create(
  fileId,
  client.itemTypes.FOLDER,
  notificationURL,
  [
    client.webhooks.triggerTypes.FILE.UPLOADED
  ]
).then(webhook => {
  console.log(util.inspect(webhook, false, null));
});
