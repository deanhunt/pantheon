var Mongolian = require('mongolian');

var urls = [
    { url: 'http://www.foxnews.com', cookie: '' },
    { url: 'http://news.ycombinator.com', cookie: '' },
    { url: 'http://www.theonion.com', cookie: '' },
    { url: 'http://www.slate.com', cookie: '' }
];

exports.boot = function(req, res){
    // Database/auth shorthand (equivalent to calling db() and auth() on the resulting server)
    var db = new Mongolian("mongodb://public:juno-and-hera@linus.mongohq.com:10034/app12606453");

};

exports.list = function(req, res){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(urls));
    res.end();
};

exports.add = function(req, res){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write('OK');
    res.end();
};


// mongodb://public:juno-and-hera@linus.mongohq.com:10034/app12606453
