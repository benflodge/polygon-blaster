var navigation = Backbone.Model.extend({
        defaults: {
            name: 'New Page',
            url: '/'
        }
    }),

    NavigationView = Marionette.ItemView.extend({
        template: "#nav-link",
        tagName: 'li'
    }),

    navigations = Backbone.Collection.extend({
        model: navigation
    }),

    pageLinks = new navigations([
        { name: 'Home', url: '/#' },
        { name: 'Game', url: '/game' },
        { name: 'Login', url: '/#login' },
        { name: 'Add User', url: '/#add-user' }
    ]),

    NavigationsView = Marionette.CompositeView.extend({
        tagName: 'ul',
        template: '<div/>',
        childView: NavigationView
});
