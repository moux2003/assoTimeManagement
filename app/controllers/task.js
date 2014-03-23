var forms = require('forms'),
    fields = forms.fields,
    validators = forms.validators;

function getNewTaskForm() {
    return forms.create({
        code: fields.string({
            required: true,
            errorAfterField: true,
            validators: [validators.maxlength(5)],
            cssClasses: {
                label: ['col-sm-2 control-label'],
                field: ['form-group']
            }
        }),
        description: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['col-sm-2 control-label'],
                field: ['form-group']
            }
        })
    });
}

exports.tasksAction = function(req, res) {
    res.render('task/tasks', {
        title: 'Tasks',
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
        form: getNewTaskForm().toHTML()
    });
}

exports.taskCreateAction = function(req, res) {
    var form = getNewTaskForm();

    form.handle(req, {
        success: function(form) {
            // there is a request and the form is valid
            // form.data contains the submitted data
            // todo => add task to BDD
            exports.tasksAction(req, res);
        },
        error: function(form) {
            // the data in the request didn't validate,
            // calling form.toHTML() again will render the error messages
            res.render('task/tasks', {
                title: 'Tasks',
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
                form: form.toHTML()
            });
        },
        empty: function(form) {
            exports.tasksAction(req, res);
        }
    });
}