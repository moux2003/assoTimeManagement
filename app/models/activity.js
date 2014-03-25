var sequelize = module.parent.exports.sequelize,
    Sequelize = require('sequelize'),
    User = require('./user'),
    Task = require('./task');

module.exports = model = sequelize.define('Activity', {
    date: {
        // DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            isDate: true
        },
        defaultValue: Sequelize.NOW
    },
    // We save duration in minutes
    duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            isInt: true
        },
        defaultValue: 0
    }
});

model
    .belongsTo(User)
    .belongsTo(Task);

model.sync();