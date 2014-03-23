var fs = require('fs'),
    security = require('./security');

exports.bootstrap = function(app) {
    // read routes
    var routes = JSON.parse(fs.readFileSync(__dirname + '/routes.json', 'utf8'));
    // process routes
    routes.forEach(function(route) {
        var prefix = route.prefix || '',
            controllerName = route.controller || null,
            controller = null;
        // check associated controller
        if (controllerName === null) {
            console.log('Routing error: no controller defined for route: ', route);
            return;
        } else {
            controller = require('../controllers/' + controllerName);
            // register routing
            route.routes.forEach(function(innerRoute) {
                var method = innerRoute.method || 'get',
                    access = innerRoute.security || 'anonymous';

                if (access === 'administrator') {
                    app[method](prefix + innerRoute.path, security.isAdministrator, controller[innerRoute.action + 'Action']);
                } else if (access === 'authenticated') {
                    app[method](prefix + innerRoute.path, security.isAuthenticated, controller[innerRoute.action + 'Action']);
                } else {
                    // We assume the default user security is anonymous
                    app[method](prefix + innerRoute.path, controller[innerRoute.action + 'Action']);
                }
            })
        }
    })
}
// TODO: define path resolver function