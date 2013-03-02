var users = [
    { name: 'TJ', email: 'tj@vision-media.ca' },
    { name: 'Tobi', email: 'tobi@vision-media.ca' }
];

exports.list = function(req, res){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(users));
    res.end();
  // res.render('users', { title: 'Users', users: users });
};
