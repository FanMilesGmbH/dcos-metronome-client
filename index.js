const Promise = require('bluebird');
const requestSync = require('request');

const request = Promise.promisify(requestSync);

const MetronomeClient = require('./MetronomeClient');

module.exports = {
  MetronomeClient,
  getInstance(metronomeBaseUrl) {
    return new MetronomeClient({
      metronomeBaseUrl,
      httpClient: request,
    });
  },
};
