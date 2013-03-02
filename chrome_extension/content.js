var PantheonContent = {
    QUERY_: '_juno_hera=1',

    // Messy hack to get around permissions issues with injecting content
    // scripts in Chrome extensions.
    initialize: function(){
        chrome.extension.sendMessage({
            query: 'isActive'
        }, function(isActive){
            if (isActive && this.matchesQuery_()) this.beginFade_();
        }.bind(this));
    },

    matchesQuery_: function(){
        var result = (window.location.href.indexOf(this.QUERY_) !== -1);
        return result;
    },

    // Probably not the best idea...
    //
    // removeQuery_: function(){
    //     var url = window.location.href;
    //     var index = url.indexOf(this.QUERY_);

    //     // Bail out if there is no query.
    //     if (index === -1) return;

    //     var before = url.substring(0, index);
    //     var after = url.substring(index + this.QUERY_.length);
    //     url = before + after;

    //     history.replaceState({}, document.title, url);
    // },

    beginFade_: function(){
        document.body.classList.add('pntn-fader');

        window.setTimeout(function(){
            document.body.classList.add('pntn-disable');
        }, 2000);
    }
};
PantheonContent.initialize();
