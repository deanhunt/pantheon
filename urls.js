var UrlParser = require('url');
var UrlsDB = require('./urls-db');

var Urls = {
    weightThreshold_: 8,

    initialize: function(){
        [
            'weighUrl_', 'urlAllowed_', 'shouldInsertSite_', 'ensureMode_',
            'list', 'add'
        ].forEach(function(method){
            exports[method] = this[method].bind(this);
        }.bind(this));
    },

    // Secret sauce.
    weighUrl_: function(url){
        // Start with a relatively low base weight.
        // It's not impossible for plain URLs to make it into the DB, but it's very
        // unlikely for slightly "bad" ones.
        var weight = 5;

        var parsedUrl = UrlParser.parse(url, true /* Parse query string. */);

        // Increase for Facebook profiles.
        if (parsedUrl.hostname.match(/facebook.com$/) && parsedUrl.path.match(/^\/[a-zA-Z0-9\.-]+$/)){
            weight += 3;
        }

        // Increase for Google search results.
        // We can afford a naive string match, since false positives don't pose a risk.
        if (parsedUrl.hostname.match(/google/) && parsedUrl.query['q']){
            weight += 2;
        }

        // Increase for query parameters. (It's okay that Google searches will count double.)
        if (Object.keys(parsedUrl.query).length){
            weight += 1;
        }

        // Decrease for plain URLs (without paths).
        if (parsedUrl.path.length < 2){
            weight -= 2;
        }

        return weight;
    },

    urlAllowed_: function(url, onSuccess, onFailure){
        // TODO(dean):
        onSuccess();
    },

    shouldInsertSite_: function(url, onSuccess, onSkipped){
        this.urlAllowed_(url, function(){
            var weight = this.weighUrl_(url);
            var roll = Math.round(Math.random() * 10);

            if (roll + weight >= this.weightThreshold_){
                onSuccess();
            } else {
                onSkipped();
            }
        }.bind(this), onSkipped);
    },

    // Close the connection if a mode isn't supplied.
    ensureMode_: function(req, res){
        var mode = req.params['mode'];
        if (mode !== 'god' && mode !== 'demi'){
            res.send('⚡');
            return false;
        } else {
            return true;
        }
    },

    list: function(req, res){
        var mode = req.params['mode'];
        if (!this.ensureMode_(req, res)) return;

        var isGod = (mode === 'god');
        UrlsDB.list(isGod, function(urls){
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(urls));
            res.end();
        }.bind(this));
    },

    add: function(req, res){
        var mode = req.params['mode'];
        if (!this.ensureMode_(req, res)) return;

        var url = req.body.url;

        this.shouldInsertSite_(url, function(){
            var data = {
                url: req.body.url,
                time: +new Date()
            }

            var isGod = (mode === 'god');
            if (isGod) data.cookie = req.body.cookie;
            UrlsDB.add(isGod, data);

            res.send('ADDED');
        }.bind(this), function(){
            res.send('SKIPPED');
        }.bind(this));
    }
};
Urls.initialize();
