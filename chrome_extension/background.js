// TODO(dean): License.
var Pantheon = {
    SERVER_: 'http://www.pantheonapp.net/urls',

    QUERY_: '_juno_hera=1',

    isActive_: false,

    socket_: null,

    userId_: null,

    availableSites_: [],

    recentlySentUrls_: [],

    initialize: function(){
        // Store the bound callback so we can unbind later.
        this.tabUpdatedBound_ = this.tabUpdated_.bind(this);
        this.tabCreatedBound_ = this.tabCreated_.bind(this);

        this.bindBrowserEvents_();

        // Grab the initial bundle of sites.
        this.getUrls_();
    },

    isActive: function(){
        return this.isActive_;
    },

    on: function(){
        this.isActive_ = true;
        chrome.browserAction.setIcon({path: "icon_on_38.png"});

        this.bindTabEvents_();
    },

    off: function(){
        this.isActive_ = false;
        chrome.browserAction.setIcon({path: "icon_off_38.png"});

        this.unbindTabEvents_();
    },

    bindBrowserEvents_: function(){
        chrome.browserAction.onClicked.addListener(this.toggleApp_.bind(this));

        chrome.extension.onMessage.addListener(this.onMessage_.bind(this));
    },

    bindTabEvents_: function(){
        chrome.tabs.onUpdated.addListener(this.tabUpdatedBound_);
        chrome.tabs.onCreated.addListener(this.tabCreatedBound_);
    },

    unbindTabEvents_: function(){
        chrome.tabs.onUpdated.removeListener(this.tabUpdatedBound_);
        chrome.tabs.onCreated.removeListener(this.tabCreatedBound_);
    },

    getUrls_: function(){
        // TODO(dean): Handle error cases.
        jQuery.get(this.SERVER_, function(data){
            Array.prototype.push.apply(this.availableSites_, data);
        }.bind(this));
    },

    onMessage_: function(request, sender, sendResponse){
        if (request.query === 'isActive'){
            sendResponse(this.isActive());
        }
    },

    toggleApp_: function(tab){
        if (this.isActive_){
            this.off();
        } else {
            this.on();
        }
    },

    sendUrl_: function(url){
        if (!url) return;

        if (this.isActive_){
            // Bail if it's not a real URL.
            if (!url.match(/^http/)) return;

            // Bail if we've just sent this URL.
            if (this.recentlySentUrls_.indexOf(url) !== -1) return;

            // Bail if it's a Pantheon URL.
            if (this.matchesQuery_(url)) return;

            chrome.cookies.getAll({
                url: url
            }, function(cookies){
                var packet = {
                    url: url,
                    // We don't want the cookies to be parsed on the initial reception.
                    cookie: JSON.stringify(cookies)
                };
                // TODO(dean): Error handling.
                jQuery.post(this.SERVER_, packet);
            }.bind(this));

            // Keep a short list of recently sent URLs so we don't repeatedly send the same URL.
            if (this.recentlySentUrls_.length > 10){
                this.recentlySentUrls_ = [];
            }
            this.recentlySentUrls_.push(url);
        }
    },

    tabUpdated_: function(tabId){
        if (!this.isActive_) return;

        chrome.tabs.get(tabId, function(tab){
            this.sendUrl_(tab.url);
        }.bind(this));
    },

    loadSite_: function(tab, site){
        var url = site.url;
        if (!url) return;

        var cookie = site.cookie;
        if (cookie){
            JSON.parse(site.cookie).forEach(function(cookie){
                // Set the URL for the current link.
                cookie.url = url;

                // Strip the unprocessable attributes from the new cookie.
                delete cookie.hostOnly;
                delete cookie.session;

                chrome.cookies.set(cookie);
            }.bind(this));
        }

        // Add a query string if we don't already have one.
        if (!this.matchesQuery_(url)){
            var prepend = (url.indexOf('?') !== -1) ? '&' : '?';
            url = url + prepend + this.QUERY_;
        }

        chrome.tabs.update(tab.id, {
            url: url
        });
    },

    matchesQuery_: function(url){
        return (url.indexOf(this.QUERY_) !== -1);
    },

    tabCreated_: function(tab){
        // Ignore non-blank tabs.
        if (tab.url !== 'chrome://newtab/') return;

        // Bail if we don't have any new URLs.
        if (!this.availableSites_.length) return;

        var site = this.availableSites_.pop();
        this.loadSite_(tab, site);

        if (this.availableSites_.length < 6){
            this.getUrls_();
        }
    }
}
Pantheon.initialize();
