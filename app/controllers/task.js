var forms = require('forms'),
    fields = forms.fields,
    validators = forms.validators,
    Task = require('../db/sql').Task;

function getNewTaskForm() {
    return forms.create({
        code: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.maxlength(5)],
            cssClasses: {
                label: ['control-label'],
                field: ['form-group']
            }
        }),
        description: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['control-label'],
                field: ['form-group']
            }
        })
    });
}

exports.tasksAction = function(req, res) {
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
            form: getNewTaskForm().toHTML(),
            tasks: tasks
        });
    });
}

exports.taskCreateAction = function(req, res) {
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

exports.taskDeleteAction = function(req, res) {
    Task.destroy({
        code: req.params.code
    }).success(function(affectedRows) {
        if (affectedRows > 0) {
            req.flash('success', 'Task ' + req.params.code + ' deleted.');
        }
        res.redirect('/admin/tasks');
    })
}