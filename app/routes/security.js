// var router = require('./router')

exports.isAuthenticated = function(req, res, next) {
    if (req.user) return next();
    res.redirect('/login');
};

exports.isAdministrator = function(req, res, next) {
    if (req.user && req.user.username === 'admin') return next();
    res.redirect('/login');
};