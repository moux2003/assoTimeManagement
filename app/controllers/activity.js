var forms = require('forms'),
    fields = forms.fields,
    widgets = forms.widgets,
    validators = forms.validators,
    customValidators = require('../forms/validators'),
    Activity = require('../db/sql').Activity,
    Task = require('../db/sql').Task;

function getNewActivityForm(callback) {
    Task.findAll().done(function(error, tasks) {
        var result = {};
        if (!error) {
            tasks.forEach(function(task) {
                result[task.code] = task.description;
            })
            var form = forms.create({
                date: fields.date({
                    required: true,
                    errorAfterField: true,
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
                }),
                task: fields.string({
                    required: true,
                    choices: result,
                    widget: widgets.select(),
                    errorAfterField: true,
                    cssClasses: {
                        label: ['control-label'],
                        field: ['form-group']
                    }
                })
            });
            callback(form);
        }
    });
}

exports.indexAction = function(req, res) {
    Activity.findAll({
        where: {
            UserId: req.user.uuid
        },
        include: [Task]
    }).success(function(activities) {
        getNewActivityForm(function(form) {
            res.render('activity/index', {
                title: 'Activities',
                nav_class: 'navbar-tasks',
                user: req.user,
                form: form.toHTML(),
                activities: activities
            });
        });
    });
}

exports.activityCreateAction = function(req, res) {
    getNewActivityForm(function(form) {
        form.handle(req, {
            success: function(form) {
                // there is a request and the form is valid
                // form.data contains the submitted data
                Activity.create({
                    date: form.data.date,
                    duration: form.data.duration
                })
                    .done(function(error, activity) {
                        if (error) {
                            req.flash('error', "couldn't save activity.");
                            res.redirect('/admin/activities');
                        } else {
                            activity.setUser(req.user);
                            Task.find({
                                where: {
                                    code: form.data.task
                                }
                            }).done(function(error, task) {
                                if (task) {
                                    activity.setTask(task).success(function() {
                                        req.flash('success', 'Activity added.');
                                        res.redirect('/admin/activities');
                                    });
                                } else {
                                    req.flash('success', 'Activity added but no Task linked.');
                                    res.redirect('/admin/activities');
                                }
                            });
                        }
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