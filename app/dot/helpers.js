exports.formatDate = function(value) {
    return ('0' + value.getDate()).slice(-2) + '/' + ('0' + (value.getMonth() + 1)).slice(-2) + '/' + value.getFullYear();
}