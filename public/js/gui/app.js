var HomeView =  Marionette.ItemView.extend({
    template: "#info-text"
});


var UserInfoView = Marionette.ItemView.extend({
    template: "#user-info"
});


var RootView = Marionette.LayoutView.extend({

    template: "#page-layout",
    regions: {
        mainRegion: '#content',

        navRegion: "#navigation",
        userInfoRegion: "#user-log",
        highScoreRegion: '#high-scores'
    },

    initialize: function () {

        this.globalChannel = Backbone.Radio.channel('global');

        this.listenTo(this.globalChannel, 'login', this.showUserInfo);
        // this.headerView = new HeaderView();
        // $('.header').html(this.headerView.render().el);

        // Close the search dropdown on click anywhere in the UI
        // $('body').click(function () {
        //     $('.dropdown').removeClass("open");
        // });


        // var pageLinksView = new NavigationsView({ collection: pageLinks });
        // var highScoresView = new HighScoresView({ collection: highScores });

        // highScores.fetch({url: '/api/scores'});
    },

    onShow: function() {

        var pageLinksView = new NavigationsView({ collection: pageLinks });

        this.navRegion.show(pageLinksView);

        var highScores = new HighScores();
        var highScoresView = new HighScoresView({ collection: highScores });
        this.highScoreRegion.show(highScoresView);
        highScores.fetch();
    },

    showHome: function () {
        this.mainRegion.show(new HomeView());
    },

    showLogin: function() {
        this.mainRegion.show(new LoginView());

    },

    showAddUser:  function() {
        this.mainRegion.show(new AddUserView());

    },

    showUserInfo: function(data) {
        this.user = new User(data);
        this.userInfoRegion.show(new UserInfoView({
            model: this.user
        }));
    }
});
 
var App = new Backbone.Marionette.Application();

App.addRegions({
  appRegion: '#app'
});

App.on('start', function() {
    console.log('start');

    App.rootView = new RootView();

    App.appRegion.show(App.rootView);

    var router = new Marionette.AppRouter({

        controller: App.rootView,
        appRoutes: {
            "": "showHome",
            "home": "showHome",
            "login" : "showLogin",
            'add-user' :'showAddUser'
        }

    });
    Backbone.history.start();
});

App.start();
