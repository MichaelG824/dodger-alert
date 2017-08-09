'use strict';

const User = require('../models/Users.js');

//Run send notifications function.
const notificationWorkerFactory = function() {
  return {
    run: function() {
      User.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();