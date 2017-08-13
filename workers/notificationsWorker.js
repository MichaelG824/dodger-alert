'use strict';

const notifyFunction = require('../twilio.js');

console.log("Hit noti");
//Run send notifications function.
const notificationForUsers = function() {
  return {
    run: function() {
        notifyFunction();
    },
  };
};

module.exports = notificationForUsers();