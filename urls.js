var UrlParser = require('url');
var UrlsDB = require('./urls-db');

var Urls = {
    weightThreshold_: 12,

    initialize: function(){
        ['weighUrl_', 'urlAllowed_', 'shouldInsertSite_', 'list', 'add'].forEach(function(method){
            exports[method] = this[method].bind(this);
        }.bind(this));
    },

    weighUrl_: function(url){
        var weight = 5;

        var parsedUrl = UrlParser.parse(url, true /* Parse query string. */);

        // Increase for Facebook profiles.
        if (parsedUrl.hostname.match(/facebook.com$/) && parsedUrl.path.match(/^\/[a-zA-Z0-9\.-]+$/)){
            weight += 3;
        }

        // Increase for Google search results. We can afford a naive string match.
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

    // TODO(dean):
    urlAllowed_: function(url, onSuccess, onFailure){
        onSuccess();
    },

    shouldInsertSite_: function(url, onSuccess, onSkipped){
        this.urlAllowed_(url, function(){
            var weight = this.weighUrl_(url);
            var roll = Math.round(Math.random() * 10);

            console.log(roll + weight, 'vs', this.weightThreshold_);
            if (roll + weight >= this.weightThreshold_){
                onSuccess();
            } else {
                onSkipped();
            }
        }.bind(this), onSkipped);
    },

    list: function(req, res){
        UrlsDB.list(function(urls){
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(urls));
            res.end();
        }.bind(this));
    },

    add: function(req, res){
        var url = req.body.url;
        var cookie = req.body.cookie;

        this.shouldInsertSite_(url, function(){
            UrlsDB.add({
                url: req.body.url,
                cookie: req.body.cookie,
                time: +new Date()
            });
            res.send('ADDED');
        }.bind(this), function(){
            res.send('SKIPPED');
        }.bind(this));
    }
};
Urls.initialize();
