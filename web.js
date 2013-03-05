var Express = require('express');
var Urls = require('./urls');

var app = Express.createServer(Express.logger());

app.use(Express.static(__dirname + '/web'));
app.use(Express.bodyParser());

app.get('/urls/:mode', Urls.list);
app.post('/urls/:mode', Urls.add);

var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("Listening on " + port);
});
