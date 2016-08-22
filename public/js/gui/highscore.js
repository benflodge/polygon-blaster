var User = Backbone.Model.extend({
    defaults: function (){
        return {
            user: 'Player',
            score: '000000000'
        }
    }
});

var HighScores = Backbone.Collection.extend({
    model: User,
    url: '/api/scores'
});


var ScoreView = Marionette.ItemView.extend({

    template: "#high-score",
    tagName: 'li'
});


var HighScoresView = Marionette.CompositeView.extend({
    
    tagName: 'ul',
    template: '<div/>',
    childView: ScoreView
});
