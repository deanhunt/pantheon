var Mongolian = require('mongolian');

// Make BSON play nicely with us.
var ObjectId = Mongolian.ObjectId;
ObjectId.prototype.toJSON = ObjectId.prototype.toString;

if (process.env.MONGO_SITES){
    db = new Mongolian(process.env.MONGO_SITES);
} else {
    var server = new Mongolian;
    // Mongo doesn't return the db proper when connected without
    // authentication (as in local).
    db = server.db('pantheon-app');
}

exports.list = function(isGod, callback){
    var collection = (isGod) ? 'godsites' : 'demisites';
    var sites = db.collection(collection);
    sites.find().limit(10).sort({time: -1}).toArray(function(err, array){
        callback(array);
    });
};

exports.add = function(isGod, data){
    var collection = (isGod) ? 'godsites' : 'demisites';
    var sites = db.collection(collection);
    sites.insert(data);
};
