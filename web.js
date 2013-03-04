var express = require('express');

var app = express.createServer(express.logger());
var urls = require('./urls');

app.use(express.static(__dirname + '/web'));
app.use(express.bodyParser());

app.get('/urls', urls.list);
app.post('/urls', urls.add);


var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("Listening on " + port);
});
