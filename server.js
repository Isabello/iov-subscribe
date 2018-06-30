var app = require('express')();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var db = require('./db/config');
var weave = require('weave/lib/weave.node.js');

let bovJSON = require('./bov/bov.json');

let bov = weave.loadJSON(bovJSON);

//setup RethinkDB environment
db.setup(register);

// Connects to a Tendermint Instance
const client = new weave.Client('wss://bov.unicornnet.iov.one');

/// Helpers
// Pretty Console Logging, if needed
pprint = o => console.log(JSON.stringify(o, null, 2));

// Initialize saveBlock Helper
saveBlock = o => db.saveHeader(o);
saveTransaction = o => db.saveTransaction(o);
parseTx = o => client.parseSubscribedTx(o.TxResult,bov.app.Tx).then(saveTransaction);


/// Subscriptions
client.subscribeHeaders(saveBlock);
client.subscribeAllTx(parseTx);

// Set pug to view engine and configure default path
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//setup the routes

app.get("/", (req, res) => {
  res.render("homepage", {
  });
});

//setup socketIO to listen for client messages
io.on('connection', function (socket) {

  // Block History
  // request:blockHistory
  // response:blockHistory
 socket.on('request:blockHistory', function (data) {
    console.log("Socket---->request:block %s", JSON.stringify(data, null, 2));
    db.getBlocks({height: data.height}, function (err, result) {
      if (err) {
        console.log("Error getting data:  %s", err);
    		return;
      }

      console.log("Block Retrieved:  %s", result);

      // Return User Data to user
      io.emit('response:blockHistory', result);
      return;
    });
  });

  // TransactionHistory
  // request:TransactionHistory
  // response:TransactionHistory
  socket.on('request:TransactionHistory', function (data) {
     console.log("Socket---->request:history %s", JSON.stringify(data, null, 2));
     db.getTransactionHistory(data.address, function (err, result) {
       if (err) {
         console.log("Error getting data:  %s", err);
         return;
       }

       console.log("History Retrieved:  %s", result);

       // Return User Data to user
       io.emit('response:TransactionHistory', result);
       return;
     });
   });
});


// Registers changefeeds from RethinkDB
function register() {
    //create the wiring to send the realtime feeds to the client

    // Pushes
    // push:transaction
    // push:header
    db.registerRealtimeBlockFeed(function (data) {
        console.log("DB---->registerRealtimeBlockFeed emit....:  " + data.new_val.block.header.height);
        io.emit('push:header', data.new_val.block.header.height);
    });

    db.registerRealtimeTransactionFeed(function (data) {
        console.log(data);
        console.log("DB---->registerRealtimeTransactionFeed emit....:  " + data.new_val.height);
        io.emit('push:transaction', data.new_val);
    });
}

//the last step:  listen for requests
server.listen(3000, function () {
  console.log('listening on *:3000');
});
