Staff = Backbone.View.extend({
    events: {
        'click button'  : 'fly'
    },

    initialize: function(){
        this.bindAutocomplete();
        $('.measure-item').keydown(function(event){
            if (event.which == 13){
                if (!event.target.parentNode.nextElementSibling){
                    this.addMeasure();
                    this.bindAutocomplete();
                }
            }
        });
    },

    bindAutocomplete: function(){
        $(".measure-item").autocomplete({
            source: Staff.movements
        });
    },

    addMeasure: function(){
        var template = document.getElementById('measure-cell-tmpl').innerHTML;
        var rows = document.querySelectorAll('.line');
        Array.prototype.slice.apply(rows).forEach(function(row){
            var elem = $(template)[0];
            row.appendChild(elem);
        }, this);
    },

    redrawTweetButton: function(){
        $('.postFlightTwitterButton').remove();
       var tweet = this.toString('↵');
       var postFlightTwitterButton = "<a class='postFlightTwitterButton' href='https://twitter.com/intent/tweet?original_referer=http%3A%2F%2FdroneML.com%2F&text=Check out my new flight path&tw_p=tweetbutton&url=http%3A%2F%2FdroneML.com%2F"+tweet+"&via=arthackday'>Tweet your flight path</a>";
//        var tweetButton = '<a href="https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Farthackday.net%2Fgaffta%2F&text='+test+'&tw_p=tweetbutton&url=http%3A%2F%droneML.com%2F&via=arthackday" data-count="vertical" class="twitter-share-button" data-via="arthackday" target="_blank" data-text="▽" data-lang="en">Tweet your flight path</a>';
        $('.tweetButton').append(postFlightTwitterButton);
    },


    fly: function(){
        var tweet = this.toString();
        document.getElementById('preview').innerHTML = tweet;

        //also launch a function to calculate the output of all rows.
        //get data from it
        var flightPath = $('form').serialize();

        console.log(flightPath);

        $('#preFlightTwitterButton').remove();
        this.redrawTweetButton();
        //this.updateTweetText();
        $.post("patrick.php", flightPath, function(data,status){
            alert("Data: " + flightPath + "\nStatus: " + status);
        });
    },

    toString: function(newline){
        newline = newline || '\n';

        var lines = [];
        var rows = document.querySelectorAll('.line');
        Array.prototype.slice.apply(rows).forEach(function(row){
            var inputs = row.querySelectorAll('input');
            inputs = Array.prototype.slice.apply(inputs);
            var rowInfo = inputs.map(function(cell){
                var value = cell.value;

                // Drop out early if no input.
                if (!value) return '·';

                var code = Staff.dictionary[value];

                // If not recognized, return space.
                if (!code) return '·';

                return code;
            }, this).join('');

            lines.push(rowInfo);
        }, this);
        return lines.join(newline);
    }
});

Staff.dictionary = {
    "Take off" : "➚",
    "Land": "↘",
    "Up": "△",
    "Down" : "▽",
    "Forward": "↑",
    "Backward": "↓",
    "Strafe Left": "↰", // Should have a better icon, straffing.
    "Strafe Right": "↱", // Should have a better icon, straffing.
    "Clockwise rotation": "↻",
    "Counterclockwise rotation": "↺"
};

Staff.movements = [
    "Take off",
    "Land",
    "Up",
    "Down",
    "Forward",
    "Backward",
    "Strafe Left",
    "Strafe Right",
    "Clockwise rotation",
    "Counterclockwise rotation"
];
