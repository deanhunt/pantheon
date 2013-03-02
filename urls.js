var urls = [
    { url: 'http://www.foxnews.com', cookie: '' },
    { url: 'http://news.ycombinator.com', cookie: '' },
    { url: 'http://www.theonion.com', cookie: '' },
    { url: 'http://www.slate.com', cookie: '' }
];

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
