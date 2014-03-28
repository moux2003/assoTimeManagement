var LPO = LPO || {};
LPO.Activity = function() {

    var init = function() {
        $('#id_date').pickadate({
            format: 'yyyy-mm-dd'
        });
    };

    var oPublic = {
        init: init
    };

    return oPublic;
}();

$(document).ready(function() {
    LPO.Activity.init();
});