var forms = require('forms'),
    fields = forms.fields,
    validators = forms.validators,
    customValidators = require('../forms/validators'),
    Activity = require('../db/sql').Activity;

function getNewActivityForm() {
    return forms.create({
        date: fields.date({
            required: true,
            errorAfterField: true,
            // validators: [customValidators.dateFr],
            cssClasses: {
                label: ['control-label'],
                field: ['form-group']
            }
        }),
        duration: fields.string({
            required: true,
            errorAfterField: true,
            // validators: [customValidators.duration],
            cssClasses: {
                label: ['control-label'],
                field: ['form-group']
            }
        })
    });
}

exports.indexAction = function(req, res) {
    Activity.findAll({
        where: {
            UserId: req.user.uuid
        }
    }).success(function(activities) {
        res.render('activity/index', {
            title: 'Activities',
            nav_class: 'navbar-tasks',
            user: req.user,
            form: getNewActivityForm().toHTML(),
            activities: activities
        });
    });
}

exports.activityCreateAction = function(req, res) {
    var form = getNewActivityForm();
    console.log('posted')
    form.handle(req, {
        success: function(form) {
            // there is a request and the form is valid
            // form.data contains the submitted data
            Activity.create({
                date: form.data.date,
                duration: form.data.duration // TODO: format duration in minutes or forms : formatter ?
            })
                .done(function(error, activity) {
                    if (error) {
                        console.log(error)
                        req.flash('error', "couldn't save activity.");
                    } else {
                        activity.setUser(req.user);
                        req.flash('success', 'Activity added.');
                    }
                    res.redirect('/admin/activities');
                });
        },
        error: function(form) {
            // the data in the request didn't validate,
            // calling form.toHTML() again will render the error messages
            Activity.findAll({
                where: {
                    UserId: req.user.uuid
                }
            }).success(function(activities) {
                console.log('error2')
                res.render('activity/index', {
                    title: 'Activities',
                    nav_class: 'navbar-tasks',
                    user: req.user,
                    form: form.toHTML(),
                    activities: activities
                });
            });
        },
        empty: function(form) {
            exports.indexAction(req, res);
        }
    });
}

exports.activityDeleteAction = function(req, res) {
    Activity.destroy({
        id: req.params.id
    }).success(function(affectedRows) {
        if (affectedRows > 0) {
            req.flash('success', 'Activity deleted.');
        }
        res.redirect('/admin/activities');
    })
}