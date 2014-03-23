/*
 *
 * nav_class = given class to add to nav-bar for custom styles, etc
     nav_class: 'navbar-home',
 *
 * nav_links = array of links to appear in the navigation bar with title and href

    nav_links: [
      { title: 'Home', href: '/'},
      { title: 'Update User', href: '/user/update'},
      { title: 'Logout', href: '/logout'}
    ]
 *
 * user = if you need to pass in the current user to the partial
       user: req.user
 *

  * styles = array of styles to pass into a given view
        styles: [
        {css: '/css/somefile.css'}
      ],
  *
  * hide_navbar = boolean to hide or show navbar - false by default
        hide_navbar:true
 */

exports.home = function(req, res) {
    res.render('home', {
        title: 'Home',
        nav_class: 'navbar-home',
        nav_links: [{
            title: 'Home',
            href: '/'
        }, {
            title: 'Update User',
            href: '/user/update'
        }, {
            title: 'Logout',
            href: '/logout'
        }],
        user: req.user
    });
};

exports.login = function(req, res) {
    res.render('login', {
        title: 'Login',
        messages: req.flash(),
        nav_class: 'navbar-login',
        nav_links: [{
            title: 'Home',
            href: '/'
        }, {
            title: 'Create User',
            href: '/create'
        }],
        user: req.user
    });
};

exports.createUser = function(req, res) {
    res.render('create', {
        title: 'Create User',
        messages: req.flash(),
        nav_links: [{
            title: 'Login',
            href: '/login'
        }]
    });
};

exports.updateUser = function(req, res) {
    res.render('update', {
        title: 'Update User',
        messages: req.flash(),
        nav_links: [{
            title: 'Home',
            href: '/'
        }, {
            title: 'Update User',
            href: '/user/update'
        }, {
            title: 'Logout',
            href: '/logout'
        }],
        user: req.user
    });
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.catchall = function(req, res) {
    res.render('404', {
        title: '404',
        hide_navbar: true
    });
};