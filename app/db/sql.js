module.exports = function() {
    var MariaClient = require('mariasql'),
        Sequelize = require('sequelize'),
        bcrypt = require('bcrypt'),

        /* Update database credentials here
         * based on your own system's configuration
         */
        sql = {
            'dbname': 'asso',
            'user': 'vagrant',
            'host': '127.0.0.1',
            'password': 'vagrant',
        };

    sql.db = new MariaClient();
    sql.db.connect({
        host: sql.host,
        user: sql.user,
        password: sql.password
    });

    sql.db.query('CREATE DATABASE IF NOT EXISTS ' + sql.dbname)
        .on('result', function(res) {
            res.on('error', function(err) {
                console.log('Client error: ' + err);
            }).on('end', function(err) {
                console.log('Database ready');
            })
        }).on('end', function() {
            console.log('Done with db check');
            sql.db.end();
        });

    var sequelize = exports.sequelize = new Sequelize(sql.dbname, sql.user, sql.password, {
        dialect: 'mariadb'
    });

    sequelize.authenticate().complete(function(err) {
        if (err) {
            new Error('app/db/sql.js: unable to connect to the database:', err);
        }
    });

    // include models here
    sql.User = require('../models/user');
    sql.Task = require('../models/task');

    // create user admin with password admin if necessary
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            console.log('sql.js: bcrypt salting error');
        } else {
            bcrypt.hash('admin', salt, function(error, password) {
                if (error) {
                    console.log('sql.js: bcrypt hashing error');
                } else {
                    sql.User.findOrCreate({
                        username: 'admin'
                    }, {
                        password: password,
                        email_address: 'admin@tobedefine.com'
                    })
                        .success(function(user, created) {
                            if (created) {
                                console.log('admin user created')
                            }
                        });
                }
            });
        }
    });

    return sql;
}();