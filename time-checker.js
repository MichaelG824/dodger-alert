'use strict';

const CronJob = require('cron').CronJob;
const notificationsForUsers = require('./workers/notificationsWorker');
const moment = require('moment');

//Check for a game every minute.
const timeChecker = function() {
  return {
    start: function() {
      new CronJob('* * * * * *', function() {
        console.log('Running Send Notifications Worker for ' +
          moment().format());
        notificationsForUsers.run();
      }, null, true, '');
    },
  };
};

module.exports = timeChecker();