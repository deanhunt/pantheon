StaffLine = Backbone.View.extend({
    events: {
        'mousedown .measure b' : 'setCursorEvent_'
    },

    initialize: function(){

    },

    render: function(){
        // Render the first few measures.
        for (var i = 0; i < StaffLine.MEASURES; i++){
            this.addMeasure();
        }

        var first = this.el.querySelector('.measure b');
        first.classList.add('cursor');
    },

    push: function(command){
        var active = this.getActive_();
        active.innerHTML = this.toCharacter_(command);

        this.incrementCursor_();

        // TODO(dean): Kind of a hack to put this here.
        this.updateOuputs_();
    },

    pop: function(){
        var active = this.getActive_();
        active.innerHTML = '';

        this.decrementCursor_();

        // TODO(dean): Kind of a hack to put this here.
        this.updateOuputs_();
    },

    advance: function(){
        var active = this.getActive_();
        this.padMeasure_(active.parentNode);

        this.incrementCursor_(true);
    },

    addMeasure: function(){
        var template = document.getElementById('measure-tmpl').innerHTML;
        var templateEl = $(template)[0];

        this.el.querySelector('#measures').appendChild(templateEl);
        return templateEl;
    },

    updateOuputs_: function(){
        // TODO(dean): Temporarily removed social behavior.
        return;

        var url = this.toURL();

        var input = this.el.querySelector('.url');
        input.value = url;

        this.redrawTweetButton_();
    },

    toString: function(){
        var lines = [];
        var rows = document.querySelectorAll('.measure');
        Array.prototype.slice.apply(rows).forEach(function(row){
            var inputs = row.querySelectorAll('b');
            inputs = Array.prototype.slice.apply(inputs);
            var rowInfo = inputs.map(function(cell){
                return cell.innerHTML || StaffLine.SPACER;
            }, this).join('');
            lines.push(rowInfo);
        }, this);
        var results = lines.join(StaffLine.LINE_BREAK);
        return results;
    },

    toURL: function(){
        var markup = this.toString();

        // HACK(dean): Strip empty measures.
        var dot = StaffLine.SPACER;
        markup = markup.replace(dot + dot + dot + dot + '|', '');
        return 'http://droneml.com/fly/' + markup;
    },

    redrawTweetButton_: function(){
        $('.postFlightTwitterButton').remove();

        var template = document.getElementById('twitter-button-tmpl').innerHTML;
        var postFlightTwitterButton = _.template(template, {
            tweet: this.toString()
        });
        $('.tweetButton').append(postFlightTwitterButton);
    },

    getActive_: function(){
        return this.$('.cursor')[0];
    },

    toCharacter_: function(command){
        if (!command) return StaffLine.SPACER;

        var match = StaffLine.DICTIONARY[command];
        return match || StaffLine.SPACER;
    },

    setCursorEvent_: function(evt){
        var active = this.getActive_();
        active.classList.remove('cursor');

        evt.target.classList.add('cursor');
    },

    padMeasure_: function(measure){
        if (!measure){
            console.error('Got a bad measure.');
            return;
        }

        var inputs = measure.querySelectorAll('b');
        Array.prototype.slice.apply(inputs).forEach(function(cell){
            if (!cell.innerHTML.trim()){
                cell.innerHTML = StaffLine.SPACER;
            }
        }, this);
    },

    decrementCursor_: function(forcePreviousMeasure){
        var active = this.getActive_();
        var sibling = active.previousElementSibling
        if (sibling && !forcePreviousMeasure){
            active.classList.remove('cursor');
            sibling.classList.add('cursor');
        } else {
            var parentSibling = active.parentNode.previousElementSibling;
            if (parentSibling){
                var previousChildren = parentSibling.querySelectorAll('b');
                var previous = previousChildren[previousChildren.length-1];
                active.classList.remove('cursor');
                previous.classList.add('cursor');
            } else {
                // Do nothing.
            }
        }
    },

    incrementCursor_: function(forceNextMeasure){
        var active = this.getActive_();
        var sibling = active.nextElementSibling
        if (sibling && !forceNextMeasure){
            active.classList.remove('cursor');
            sibling.classList.add('cursor');
        } else {
            var parentSibling = active.parentNode.nextElementSibling;
            if (parentSibling){
                var next = parentSibling.querySelector('b');
                active.classList.remove('cursor');
                next.classList.add('cursor');
            } else {
                // Don't create additional measures.
            }
        }
    }
});

StaffLine.MEASURES = 14;

StaffLine.SPACER = '·';

StaffLine.LINE_BREAK = '|';

StaffLine.DICTIONARY = {
    "take-off" : "➚",
    "land": "↘",
    "up": "△",
    "down" : "▽",
    'forward': "↑",
    'backward': "↓",
    "left": "←",
    "right": "→",
    "clockwise": "↻",
    "counterclockwise": "↺"
};
