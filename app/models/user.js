var sequelize = module.parent.exports.sequelize,
    Sequelize = require('sequelize');

/* Sequelize model definition for user
 * All options, types and validations can be found
 * on their website
 */
module.exports = model = sequelize.define('User', {
    // @see http://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29
    // @see http://sequelizejs.com/docs/latest/models#block-2-line-23
    uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false
    },
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    email_address: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: "Email address is invalid"
            },
        }
    }
}, {
    underscored: true
});

model.sync();