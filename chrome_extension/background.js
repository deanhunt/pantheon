// TODO(dean): License.
var Pantheon = {
    SERVER_: 'localhost:5000',

    isActive_: false,

    socket_: null,

    userId_: null,

    availableUrls_: [],

    recentlySentUrls_: [],

    initialize: function(){
        // TODO(dean): Bootstrap with a list of 10 URLs from the server.
        // Then continue pulling another 10 every time we make it down to 5.

        // Store the bound callback so we can unbind later.
        this.tabUpdatedBound_ = this.tabUpdated_.bind(this);
        this.tabCreatedBound_ = this.tabCreated_.bind(this);

        this.bindBrowserEvents_();
    },

    isActive: function(){
        return this.isActive_;
    },

    on: function(){
        this.isActive_ = true;
        chrome.browserAction.setIcon({path: "icon_38_i.png"});

        this.bindTabEvents_();
        this.bindNetworkEvents_();
    },

    off: function(){
        this.isActive_ = false;
        chrome.browserAction.setIcon({path: "icon_38_bw.png"});

        this.unbindTabEvents_();
        this.unbindNetworkEvents_();
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
                    user_id: this.userId_,
                    url: url,
                    // We don't want the cookies to be parsed on the initial
                    // receipt.
                    cookie: JSON.stringify(cookies)
                });
                this.socket_.send(packet);
            }.bind(this));

            // Keep a short list of recently sent URLs.
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

    tabCreated_: function(tab){
        // Ignore non-blank tabs.
        if (tab.url !== 'chrome://newtab/') return;

        // Bail if we don't have any new URLs.
        if (!this.availableUrls_.length) return;

        chrome.tabs.update(tab.id, {
            url: this.availableUrls_.pop()
        })
    }
}
Pantheon.initialize();
