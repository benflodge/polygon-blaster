var LoginView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Login View');

    },

    events: {
        "click #loginButton": "login"
    },

    render:function () {
        var tmpl =  Handlebars.compile($("#login-form").html());
        $(this.el).html(tmpl({id:22}));
        return this;
    },

    login:function (event) {
        event.preventDefault(); // Don't let this button submit the form
        $('.alert-error').hide(); // Hide any errors on a new submit
        var url = '../api/login';

        var formValues = {
            user: $('#inputName').val(),
            password: $('#inputPassword').val(),
            remember: $('#remember')[0].checked
        };

        $.ajax({
            url:url,
            type:'POST',
            dataType:"json",
            data: formValues,
            success:function (data) {
                console.log(["Login request details: ", data]);

                if(data.error) {  // If there is an error, show the error messages
                    $('.alert-error').text(data.error.text).show();
                }
                else { // If not, send them back to the home page

                    var globalChannel = Backbone.Radio.channel('global');
                    globalChannel.trigger('login', data);


                    window.location.replace('#');
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log("FETCH FAILED: " + errorThrown);
            }
        });
    },

});


