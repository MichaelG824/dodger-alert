'use strict';

const notifyFunction = require('./twilio.js');

//Run send notifications function.
const notificationWorkerFactory = function() {
  return {
    run: function() {
        notifyFunction();
    },
  };
};

module.exports = notificationWorkerFactory;