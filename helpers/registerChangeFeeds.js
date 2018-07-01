var db = require('../db/config');
const { io } = require("../server");

// Registers changefeeds from RethinkDB
function register() {
  //create the wiring to send the realtime feeds to the client
  db.registerRealtimeBlockFeed(function (data) {
    console.log("DB---->registerRealtimeBlockFeed emit....:  " + data);
    io.emit('push:header', data);
  });
  db.registerRealtimeTransactionFeed(function (data) {
    console.log("DB---->registerRealtimeTransactionFeed emit....:  " + data);
    io.emit('push:transaction', data);
  });
}

exports.register = register;