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
            validators: [validators.date],
            cssClasses: {
                label: ['control-label'],
                field: ['form-group']
            }
        }),
        duration: fields.string({
            required: true,
            errorAfterField: true,
            validators: [customValidators.duration],
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
            messages: req.flash(),
            nav_class: 'navbar-tasks',
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
            user: req.user,
            form: getNewActivityForm().toHTML(),
            activities: activities
        });
    });
}

exports.activityCreateAction = function(req, res) {
    var form = getNewTaskForm();

    form.handle(req, {
        success: function(form) {
            // there is a request and the form is valid
            // form.data contains the submitted data
            Task.findOrCreate({
                code: form.data.code
            }, {
                description: form.data.description
            })
                .success(function(task, created) {
                    if (!created) {
                        task.updateAttributes({
                            description: form.data.description
                        }).success(function() {
                            req.flash('success', 'Task updated.')
                            exports.tasksAction(req, res);
                        })
                    } else {
                        req.flash('success', 'Task created.')
                        exports.tasksAction(req, res);
                    }
                })
        },
        error: function(form) {
            // the data in the request didn't validate,
            // calling form.toHTML() again will render the error messages
            Task.findAll().success(function(tasks) {
                res.render('task/tasks', {
                    title: 'Tasks',
                    messages: req.flash(),
                    nav_class: 'navbar-tasks',
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
                    user: req.user,
                    form: form.toHTML(),
                    tasks: tasks
                });
            });
        },
        empty: function(form) {
            exports.tasksAction(req, res);
        }
    });
}

exports.activityDeleteAction = function(req, res) {
    Task.destroy({
        code: req.params.code
    }).success(function(affectedRows) {
        if (affectedRows > 0) {
            req.flash('success', 'Task ' + req.params.code + ' deleted.');
        }
        res.redirect('/admin/tasks');
    })
}