var express = require('express');

var app = express.createServer(express.logger());
var urls = require('./urls');
var olof = require('./olof');

app.get('/', function(request, response){
  response.send('Hello World!!1');
});

app.get('/urls', urls.list);
app.all('/olof', olof.list);

var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("Listening on " + port);
});
