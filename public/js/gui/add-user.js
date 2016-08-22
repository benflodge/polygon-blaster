var AddUserView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Add User View');
    },

    events: {
        "click #addUserButton": "addUser"
    },

    render:function () {
        var tmpl =  Handlebars.compile($("#add-user-form").html());
        $(this.el).html(tmpl({id:22}));
        return this;
    },

    addUser:function (event) {
        event.preventDefault(); // Don't let this button submit the form
        $('.alert-error').hide(); // Hide any errors on a new submit
        var url = '../api/add-user';
        console.log('Adding User... ');

        var formValues = {
            user: $('#inputName').val(),
            email: $('#inputEmail').val(),
            password: $('#inputPassword').val()
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
    }
});


