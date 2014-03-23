var sequelize = module.parent.exports.sequelize,
    Sequelize = require('sequelize');

module.exports = model = sequelize.define('Task', {
    code: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
        validate: {
            len: [1, 5]
        }
    },
    description: {
        type: Sequelize.STRING,
        defaultValue: ''
    }
});

model.sync();