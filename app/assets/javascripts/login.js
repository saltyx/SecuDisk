// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
//= require jquery
//= require semantic-ui

$(document)
    .ready(function() {
        var loginForm = $('.ui.form');
        loginForm.form({
            fields: {
                email: {
                    identifier  : 'email',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your e-mail'
                        },
                        {
                            type   : 'email',
                            prompt : 'Please enter a valid e-mail'
                        }
                    ]
                },
                password: {
                    identifier  : 'password',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your password'
                        }
                    ]
                }
            }
        });

        loginForm.submit(function (ev) {
            $.ajax({
                type: loginForm.attr('method'),
                beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                url: loginForm.attr('action'),
                data: loginForm.serialize(),
                success: function (data) {
                    console.log(data);
                    if ('success' === data) {
                        window.location.href = '/main';
                    }
                }
            })
            ev.preventDefault();
        })

    });