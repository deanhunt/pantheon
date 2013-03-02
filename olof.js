exports.list = function(req, res){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write('hello!');
    res.end();
};
