// TODO(dean): License.
var Pantheon = {
<<<<<<< HEAD
    SERVER_: '192.168.10.147:5000',
=======
    SERVER_: 'http://www.pantheonapp.net/urls',
>>>>>>> 84fb1730a2980e6ab43a3d7e5f1b0dd5767f635f

    isActive_: false,

    socket_: null,

    userId_: null,

<<<<<<< HEAD
    availableUrls_: [],
=======
    availableSites_: [],
>>>>>>> 84fb1730a2980e6ab43a3d7e5f1b0dd5767f635f

    recentlySentUrls_: [],

    initialize: function(){
<<<<<<< HEAD
        // TODO(dean): Bootstrap with a list of 10 URLs from the server.
        // Then continue pulling another 10 every time we make it down to 5.

=======
>>>>>>> 84fb1730a2980e6ab43a3d7e5f1b0dd5767f635f
        // Store the bound callback so we can unbind later.
        this.tabUpdatedBound_ = this.tabUpdated_.bind(this);
        this.tabCreatedBound_ = this.tabCreated_.bind(this);

        this.bindBrowserEvents_();
<<<<<<< HEAD
=======

        // Grab the initial bundle of sites.
        this.getUrls_();
>>>>>>> 84fb1730a2980e6ab43a3d7e5f1b0dd5767f635f
    },

    isActive: function(){
        return this.isActive_;
    },

    on: function(){
        this.isActive_ = true;
        chrome.browserAction.setIcon({path: "icon_on_38.png"});

        this.bindTabEvents_();
<<<<<<< HEAD
        this.bindNetworkEvents_();
=======
>>>>>>> 84fb1730a2980e6ab43a3d7e5f1b0dd5767f635f
    },

    off: function(){
        this.isActive_ = false;
        chrome.browserAction.setIcon({path: "icon_off_38.png"});

        this.unbindTabEvents_();
<<<<<<< HEAD
        this.unbindNetworkEvents_();
=======
>>>>>>> 84fb1730a2980e6ab43a3d7e5f1b0dd5767f635f
    },

    bindBrowserEvents_: function(){
        chrome.browserAction.onClicked.addListener(this.toggleApp_.bind(this));
    },

    bindTabEvents_: function(){
        chrome.tabs.onUpdated.addListener(this.tabUpdatedBound_);
        chrome.tabs.onCreated.addListener(this.tabCreatedBound_);
    },

    unbindTabEvents_: function(){
        chrome.tabs.onUpdated.removeListener(this.tabUpdatedBound_);
        chrome.tabs.onCreated.removeListener(this.tabCreatedBound_);
    },

<<<<<<< HEAD
    bindNetworkEvents_: function(){
        this.socket_ = new WebSocket("ws://" + this.SERVER_  + "/websocket");
        this.socket_.onmessage = this.onMessage_.bind(this);
    },

    unbindNetworkEvents_: function(){
        this.socket_.onmessage = null;
        this.socket_.close();
    },

    onMessage_: function(evt){
        var data = evt.data;
        if (data.match(/^http/)){
            // TODO(dean): This is a temporary hack. These should be coming
            // from the web server.
            data = data.split('[[COOKIE]]');
            var url = data[0];
            var cookie = data[1];
            this.availableUrls_.push(url);
            // TODO(dean): The cookie should be applied at the time of
            // navigation.
            JSON.parse(cookie).forEach(function(cookie){
                // Set the URL for the current link.
                cookie.url = url;

                // Strip the unprocessable attributes from the new cookie.
                delete cookie.hostOnly;
                delete cookie.session;

                chrome.cookies.set(cookie);
            }.bind(this));
            // TODO(dean): Remove this no-op once on new code.
        } else if (data == 'entangled'){
            // TODO(dean): Remove this no-op once on new code.
        } else if (data == 'unentangled'){
            // TODO(dean): Remove this once on new code.
        } else if (data != 'OK'){
            this.userId_ = data;
        }
=======
    getUrls_: function(){
        // TODO(dean): Handle error cases.
        jQuery.get(this.SERVER_, function(data){
            Array.prototype.push.apply(this.availableSites_, data);
        }.bind(this));
>>>>>>> 84fb1730a2980e6ab43a3d7e5f1b0dd5767f635f
    },

    toggleApp_: function(tab){
        if (this.isActive_){
            this.off();
        } else {
            this.on();
        }
    },

    sendUrl_: function(url){
        if (this.isActive_){
            // Bail if it's not a real URL.
            if (!url.match(/^http/)) return;

            // Bail if we've just sent this URL.
            if (this.recentlySentUrls_.indexOf(url) !== -1) return;

            chrome.cookies.getAll({
                url: url
            }, function(cookies){
                var packet = JSON.stringify({
<<<<<<< HEAD
                    user_id: this.userId_,
                    url: url,
                    // We don't want the cookies to be parsed on the initial
                    // receipt.
                    cookie: JSON.stringify(cookies)
                });
                this.socket_.send(packet);
            }.bind(this));

            // Keep a short list of recently sent URLs.
=======
                    url: url,
                    // We don't want the cookies to be parsed on the initial reception.
                    cookie: JSON.stringify(cookies)
                });
                // TODO(dean): Error handling.
                jQuery.post(this.SERVER_, packet);
            }.bind(this));

            // Keep a short list of recently sent URLs so we don't repeatedly send the same URL.
>>>>>>> 84fb1730a2980e6ab43a3d7e5f1b0dd5767f635f
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

<<<<<<< HEAD
=======
    loadSite_: function(tab, site){
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

        chrome.tabs.update(tab.id, {
            url: site.url
        });
    },

>>>>>>> 84fb1730a2980e6ab43a3d7e5f1b0dd5767f635f
    tabCreated_: function(tab){
        // Ignore non-blank tabs.
        if (tab.url !== 'chrome://newtab/') return;

        // Bail if we don't have any new URLs.
<<<<<<< HEAD
        if (!this.availableUrls_.length) return;

        chrome.tabs.update(tab.id, {
            url: this.availableUrls_.pop()
        })
=======
        if (!this.availableSites_.length) return;

        var site = this.availableSites_.pop();
        this.loadSite_(tab, site);

        if (this.availableSites_.length < 6){
            this.getUrls_();
        }
>>>>>>> 84fb1730a2980e6ab43a3d7e5f1b0dd5767f635f
    }
}
Pantheon.initialize();
