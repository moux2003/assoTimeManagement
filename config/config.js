var express = require('express'),
    passport = require('passport'),
    dot = require('dot-emc'),
    flash = require('connect-flash');

exports.configure = function(app) {
    app.engine('dot', dot.init({
        app: app,
        fileExtension: 'dot',
        // for development only
        options: {
            templateSettings: {
                cache: false
            }
        }
    }).__express);
    app.set('view engine', 'dot');
    app.set('views', __dirname + '/../public/views/');

    app.configure(function() {
        app.use(express.static(__dirname + '/../public/'));
        app.use(express.json());

        app.use(function(req, res, next) {
            // Using this for debug purposes
            console.log('handling request for: ' + req.url);
            next();
        });
        app.use(express.urlencoded());
        app.use(express.cookieParser('fdk;133jna;l12jj3k'));
        app.use(express.session({
            secret: '3j143kl2;7poih;jkl;'
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        // use connect-flash for flash messages stored in session
        // we use these keys: 'info', 'warning', 'error', 'success'
        app.use(flash());
    });
};