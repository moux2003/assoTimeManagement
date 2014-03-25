exports.duration = function(message) {
    if (!message) {
        message = 'Please enter a duration respecting the followinf format: "hh:mm"';
    }
    var re = /^(1?[0-9]|2[0-3]):[0-5][0-9]$/i;
    return function(form, field, callback) {
        if (re.test(field.data)) {
            callback();
        } else {
            callback(message);
        }
    };
};