var express = require('express'),
    app = express(),
    config = require('./config/config').configure(app),
    http = require('http'),
    app_routes = require('./app/routes/application'),
    auth_routes = require('./app/routes/authentication'),
    router = require('./app/routes/router').bootstrap(app);

app.get('/login', app_routes.login);
app.get('/', auth_routes.isAuthenticated, app_routes.home);
app.get('/create', app_routes.createUser);
app.get('/user/update', auth_routes.isAuthenticated, app_routes.updateUser);
app.get('/logout', app_routes.logout);

//local authentication routes
app.post('/user/create', auth_routes.localCreate);
app.post('/user/delete', auth_routes.isAuthenticated, auth_routes.localDelete);
app.post('/user/update', auth_routes.isAuthenticated, auth_routes.localUpdate);
app.post('/user/password', auth_routes.isAuthenticated, auth_routes.localPasswordUpdate);
app.post('/login', auth_routes.localAuthentication);

// 404 catchall
app.use(app_routes.catchall);

http.createServer(app).listen(3000);